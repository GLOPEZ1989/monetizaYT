const fs = require('fs');
const path = require('path');
const { connectDB } = require('./database');
const { User, Video } = require('./models');

// Función para extraer ID de video de YouTube
function getYouTubeVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Función para generar duración aleatoria entre 1-10 minutos
function getRandomDuration() {
  return Math.floor(Math.random() * 540) + 60; // 60 a 600 segundos (1-10 min)
}

async function seedRealVideos() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Obtener usuarios
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      process.exit(1);
    }

    // Leer todos los archivos JSON de URLs
    const urlsDir = path.join(__dirname, '..', 'resources', 'URLs');
    const files = fs.readdirSync(urlsDir).filter(f => f.endsWith('.json'));
    
    console.log(`📁 Encontrados ${files.length} archivos JSON`);
    
    // Recopilar todos los videos de todos los archivos
    let allVideos = [];
    
    for (const file of files) {
      const filePath = path.join(urlsDir, file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Convertir objeto JSON en array de videos
      const videos = Object.entries(jsonData).map(([title, url]) => ({
        title: title,
        youtubeUrl: url,
        videoId: getYouTubeVideoId(url)
      })).filter(v => v.videoId); // Solo videos con ID válido
      
      allVideos = allVideos.concat(videos);
      console.log(`📄 ${file}: ${videos.length} videos`);
    }
    
    console.log(`\n🎥 Total de videos disponibles: ${allVideos.length}`);
    
    // Mezclar array para distribución aleatoria
    for (let i = allVideos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allVideos[i], allVideos[j]] = [allVideos[j], allVideos[i]];
    }
    
    // Asignar videos a usuarios (25-30 videos por usuario)
    const videosPerUser = Math.floor(allVideos.length / users.length);
    const maxVideosPerUser = Math.min(30, videosPerUser);
    
    console.log(`👥 Asignando ~${maxVideosPerUser} videos por usuario\n`);
    
    let videoIndex = 0;
    let totalCreated = 0;
    
    for (let i = 0; i < users.length && videoIndex < allVideos.length; i++) {
      const user = users[i];
      const videosToAssign = Math.min(maxVideosPerUser, allVideos.length - videoIndex);
      let userVideoCount = 0;
      
      console.log(`👤 Procesando videos para ${user.username}:`);
      
      for (let j = 0; j < videosToAssign && videoIndex < allVideos.length; j++) {
        const video = allVideos[videoIndex];
        
        // Verificar si el video ya existe
        const existingVideo = await Video.findOne({ 
          where: { videoId: video.videoId } 
        });

        if (!existingVideo) {
          try {
            await Video.create({
              title: video.title,
              youtubeUrl: video.youtubeUrl,
              videoId: video.videoId,
              ownerId: user.id,
              duration: getRandomDuration(),
              thumbnail: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
              description: `Video de idiomas: ${video.title}`,
              status: 'active'
            });
            
            userVideoCount++;
            totalCreated++;
            
            if (userVideoCount % 5 === 0) {
              process.stdout.write(`  ✓ ${userVideoCount} videos creados\n`);
            }
          } catch (error) {
            console.log(`    ❌ Error con video ${video.videoId}: ${error.message}`);
          }
        } else {
          console.log(`    - Video ${video.videoId} ya existe`);
        }
        
        videoIndex++;
      }
      
      console.log(`  📊 Total para ${user.username}: ${userVideoCount} videos\n`);
    }

    console.log(`🎉 Proceso completado:`);
    console.log(`   - ${totalCreated} videos creados exitosamente`);
    console.log(`   - Distribuidos entre ${users.length} usuarios`);
    console.log(`   - Promedio: ~${Math.floor(totalCreated/users.length)} videos por usuario`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creando videos:', error);
    process.exit(1);
  }
}

seedRealVideos();
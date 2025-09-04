const { connectDB } = require('./database');
const { User, Video } = require('./models');

// Función para extraer ID de video de YouTube
function getYouTubeVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function seedVideos() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Obtener usuarios
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos. Ejecuta primero seedUsers.js');
      process.exit(1);
    }

    // Videos ficticios (URLs reales de YouTube)
    const videoData = [
      {
        title: 'Tutorial JavaScript Básico',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 180 // 3 minutos
      },
      {
        title: 'Cómo crear una App con React',
        youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        duration: 300 // 5 minutos
      },
      {
        title: 'Node.js para Principiantes',
        youtubeUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
        duration: 420 // 7 minutos
      },
      {
        title: 'Base de Datos SQLite Tutorial',
        youtubeUrl: 'https://www.youtube.com/watch?v=byHcYRpMgI4',
        duration: 240 // 4 minutos
      },
      {
        title: 'Electron Desktop Apps',
        youtubeUrl: 'https://www.youtube.com/watch?v=kN1Czs0m1SU',
        duration: 360 // 6 minutos
      },
      {
        title: 'Git y GitHub para Desarrolladores',
        youtubeUrl: 'https://www.youtube.com/watch?v=HVsySz-h9r4',
        duration: 480 // 8 minutos
      },
      {
        title: 'CSS Flexbox Completo',
        youtubeUrl: 'https://www.youtube.com/watch?v=JJSoEo8JSnc',
        duration: 360 // 6 minutos
      },
      {
        title: 'API REST con Express',
        youtubeUrl: 'https://www.youtube.com/watch?v=pKd0Rpw7O48',
        duration: 420 // 7 minutos
      }
    ];

    let videoIndex = 0;
    
    // Asignar 2 videos a cada usuario (excepto el último que tendrá 1 o 2)
    for (let i = 0; i < users.length && videoIndex < videoData.length; i++) {
      const user = users[i];
      const videosPerUser = i === users.length - 1 ? 
        videoData.length - videoIndex : // Último usuario toma los videos restantes
        Math.min(2, videoData.length - videoIndex); // Máximo 2 videos por usuario

      for (let j = 0; j < videosPerUser && videoIndex < videoData.length; j++) {
        const video = videoData[videoIndex];
        const videoId = getYouTubeVideoId(video.youtubeUrl);
        
        if (!videoId) {
          console.log(`❌ URL inválida: ${video.youtubeUrl}`);
          videoIndex++;
          continue;
        }

        // Verificar si el video ya existe
        const existingVideo = await Video.findOne({ 
          where: { videoId } 
        });

        if (!existingVideo) {
          await Video.create({
            title: video.title,
            youtubeUrl: video.youtubeUrl,
            videoId: videoId,
            ownerId: user.id,
            duration: video.duration,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            description: `Video subido por ${user.username}`,
            status: 'active'
          });
          
          console.log(`✓ Video "${video.title}" creado para ${user.username}`);
        } else {
          console.log(`- Video "${video.title}" ya existe`);
        }
        
        videoIndex++;
      }
    }

    console.log('\n🎉 Proceso de creación de videos completado');
    process.exit(0);
    
  } catch (error) {
    console.error('Error creando videos:', error);
    process.exit(1);
  }
}

seedVideos();
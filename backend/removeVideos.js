const { connectDB } = require('./database');
const { Video } = require('./models');

async function removeVideos() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Eliminar todos los videos
    const deletedCount = await Video.destroy({
      where: {},
      truncate: true
    });
    
    console.log(`✓ ${deletedCount} videos eliminados de la base de datos`);
    console.log('🎉 Base de datos limpiada - solo quedan los usuarios');
    process.exit(0);
    
  } catch (error) {
    console.error('Error eliminando videos:', error);
    process.exit(1);
  }
}

removeVideos();
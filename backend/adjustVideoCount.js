const { connectDB } = require('./database');
const { User, Video } = require('./models');

async function adjustVideoCount() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Obtener usuarios
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      process.exit(1);
    }

    console.log('🎯 Ajustando cantidad de videos por usuario (20-30 aleatorio)\n');
    
    for (const user of users) {
      // Cantidad actual de videos
      const currentCount = await Video.count({ where: { ownerId: user.id } });
      
      // Generar cantidad aleatoria entre 20-30
      const targetCount = Math.floor(Math.random() * 11) + 20; // 20-30
      
      console.log(`👤 ${user.username}:`);
      console.log(`   Actual: ${currentCount} videos`);
      console.log(`   Objetivo: ${targetCount} videos`);
      
      if (currentCount > targetCount) {
        // Eliminar videos aleatorios
        const toDelete = currentCount - targetCount;
        const videosToDelete = await Video.findAll({
          where: { ownerId: user.id },
          order: [['createdAt', 'DESC']], // Eliminar los más recientes
          limit: toDelete
        });
        
        for (const video of videosToDelete) {
          await video.destroy();
        }
        
        console.log(`   ✂️ Eliminados ${toDelete} videos`);
      } else if (currentCount < targetCount) {
        console.log(`   ✅ Ya tiene la cantidad correcta (no agregar más)`);
      } else {
        console.log(`   ✅ Cantidad perfecta`);
      }
      
      // Verificar cantidad final
      const finalCount = await Video.count({ where: { ownerId: user.id } });
      console.log(`   📊 Final: ${finalCount} videos\n`);
    }

    // Mostrar resumen final
    console.log('📈 Resumen final:');
    for (const user of users) {
      const count = await Video.count({ where: { ownerId: user.id } });
      console.log(`   ${user.username}: ${count} videos`);
    }
    
    console.log('\n🎉 Ajuste completado - ahora cada usuario tiene cantidad aleatoria entre 20-30');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error ajustando videos:', error);
    process.exit(1);
  }
}

adjustVideoCount();
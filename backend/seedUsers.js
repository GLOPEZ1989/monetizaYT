const { connectDB } = require('./database');
const { User } = require('./models');

async function seedUsers() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Usuarios ficticios
    const users = [
      {
        username: 'Usuario1',
        email: 'u1@test.com',
        password: '123456',
        watchTime: 300,
        earnedTime: 0
      },
      {
        username: 'Usuario2',
        email: 'u2@test.com',
        password: '123456',
        watchTime: 300,
        earnedTime: 0
      },
      {
        username: 'Usuario3',
        email: 'u3@test.com',
        password: '123456',
        watchTime: 300,
        earnedTime: 0
      },
      {
        username: 'Usuario4',
        email: 'u4@test.com',
        password: '123456',
        watchTime: 300,
        earnedTime: 0
      },
      {
        username: 'Usuario5',
        email: 'u5@test.com',
        password: '123456',
        watchTime: 300,
        earnedTime: 0
      }
    ];

    // Verificar si los usuarios ya existen
    for (const userData of users) {
      const existingUser = await User.findOne({ 
        where: { username: userData.username } 
      });
      
      if (!existingUser) {
        await User.create(userData);
        console.log(`✓ Usuario ${userData.username} creado exitosamente`);
      } else {
        console.log(`- Usuario ${userData.username} ya existe`);
      }
    }

    console.log('\n🎉 Proceso de creación de usuarios completado');
    process.exit(0);
    
  } catch (error) {
    console.error('Error creando usuarios:', error);
    process.exit(1);
  }
}

seedUsers();
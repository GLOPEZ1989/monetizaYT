const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Usuario o email ya existe' 
      });
    }
    
    // Crear nuevo usuario
    const user = new User({
      username,
      email,
      password,
      watchTime: 300, // 5 minutos iniciales
      earnedTime: 0
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'Usuario creado exitosamente' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Error del servidor' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Credenciales inválidas' 
      });
    }
    
    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Credenciales inválidas' 
      });
    }
    
    // Crear token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        watchTime: user.watchTime,
        earnedTime: user.earnedTime
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Error del servidor' 
    });
  }
});

module.exports = router;
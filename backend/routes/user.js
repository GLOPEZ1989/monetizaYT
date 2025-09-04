const express = require('express');
const { User, Video } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtener perfil del usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    const videosCount = await Video.count({ 
      where: { ownerId: user.id } 
    });
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      watchTime: user.watchTime,
      earnedTime: user.earnedTime,
      totalWatched: user.totalWatched,
      videosCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar estadísticas del usuario
router.put('/stats', auth, async (req, res) => {
  try {
    const { earnedTime, watchTime, totalWatched } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (earnedTime) user.earnedTime += earnedTime;
    if (totalWatched) user.totalWatched += totalWatched;
    if (watchTime !== undefined) user.watchTime = watchTime;
    
    const updatedUser = await user.save();
    
    res.json({
      watchTime: updatedUser.watchTime,
      earnedTime: updatedUser.earnedTime,
      totalWatched: updatedUser.totalWatched
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
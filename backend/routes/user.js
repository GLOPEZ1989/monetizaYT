const express = require('express');
const User = require('../models/User');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtener perfil del usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    const videosCount = await Video.countDocuments({ owner: user._id });
    
    res.json({
      id: user._id,
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
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          earnedTime: earnedTime || 0,
          totalWatched: totalWatched || 0
        },
        $set: {
          watchTime: watchTime !== undefined ? watchTime : req.user.watchTime
        }
      },
      { new: true }
    );
    
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
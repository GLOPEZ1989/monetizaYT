const express = require('express');
const { Video, User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Función para extraer ID de video de YouTube
function getYouTubeVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Función simulada para obtener información del video (en producción usarías YouTube API)
function getVideoInfo(videoId) {
  return {
    title: `Video ${videoId.substring(0, 8)}`,
    duration: Math.floor(Math.random() * 600) + 60, // 1-10 minutos
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  };
}

// Agregar nuevo video
router.post('/', auth, async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    
    if (!youtubeUrl) {
      return res.status(400).json({ message: 'URL de YouTube es requerida' });
    }
    
    const videoId = getYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      return res.status(400).json({ message: 'URL de YouTube inválida' });
    }
    
    // Verificar si el video ya existe
    const existingVideo = await Video.findOne({ 
      where: { videoId } 
    });
    if (existingVideo) {
      return res.status(400).json({ message: 'Este video ya fue agregado' });
    }
    
    // Obtener información del video
    const videoInfo = getVideoInfo(videoId);
    
    // Crear nuevo video
    const video = await Video.create({
      title: videoInfo.title,
      youtubeUrl,
      videoId,
      ownerId: req.user.id,
      duration: videoInfo.duration,
      thumbnail: videoInfo.thumbnail
    });
    
    res.status(201).json({
      message: 'Video agregado exitosamente',
      video: {
        id: video.id,
        title: video.title,
        duration: video.duration,
        thumbnail: video.thumbnail
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener videos para ver (de otros usuarios)
router.get('/to-watch', auth, async (req, res) => {
  try {
    const videos = await Video.findAll({ 
      where: { 
        ownerId: {
          [require('sequelize').Op.ne]: req.user.id
        },
        status: 'active'
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['username']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    res.json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Marcar video como visto
router.post('/:videoId/watched', auth, async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.videoId);
    
    if (!video) {
      return res.status(404).json({ message: 'Video no encontrado' });
    }
    
    // Incrementar vistas del video
    video.views += 1;
    video.watchTime += video.duration;
    await video.save();
    
    // Actualizar estadísticas del usuario que vio el video
    const viewer = await User.findByPk(req.user.id);
    viewer.totalWatched += video.duration;
    viewer.earnedTime += video.duration;
    await viewer.save();
    
    // Actualizar estadísticas del propietario del video
    const owner = await User.findByPk(video.ownerId);
    owner.watchTime += video.duration;
    await owner.save();
    
    res.json({ 
      message: 'Video marcado como visto',
      earnedTime: video.duration 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener mis videos
router.get('/my-videos', auth, async (req, res) => {
  try {
    const videos = await Video.findAll({ 
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
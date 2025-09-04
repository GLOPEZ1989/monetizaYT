const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  youtubeUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(v);
      },
      message: 'Please enter a valid YouTube URL'
    }
  },
  videoId: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  watchTime: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);
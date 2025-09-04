const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  youtubeUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
      isYouTubeUrl(value) {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
        if (!regex.test(value)) {
          throw new Error('Please enter a valid YouTube URL');
        }
      }
    }
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  watchTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  thumbnail: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'completed'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

module.exports = Video;
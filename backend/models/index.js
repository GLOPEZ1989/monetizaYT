const User = require('./User');
const Video = require('./Video');

// Definir relaciones
User.hasMany(Video, {
  foreignKey: 'ownerId',
  as: 'videos'
});

Video.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner'
});

module.exports = {
  User,
  Video
};
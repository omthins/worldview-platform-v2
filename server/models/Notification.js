const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'comment_reply',
      'new_worldview',
      'poll_result',
      'system',
      'mention'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  relatedEntityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  relatedEntityType: {
    type: DataTypes.ENUM('worldview', 'poll', 'comment', 'user'),
    allowNull: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

  return Notification;
};
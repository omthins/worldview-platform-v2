const sequelize = require('../config/database');
const User = require('./User');
const Worldview = require('./Worldview');
const Comment = require('./Comment');

const Notification = require('./Notification')(sequelize);

// 定义模型关联
User.hasMany(Worldview, { foreignKey: 'authorId', as: 'worldviews', onDelete: 'CASCADE' });
Worldview.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Worldview.hasMany(Comment, { foreignKey: 'worldviewId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Worldview, { foreignKey: 'worldviewId', as: 'worldview' });

Comment.hasMany(Comment, { foreignKey: 'parentCommentId', as: 'replies', onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { foreignKey: 'parentCommentId', as: 'parentComment' });

// 多对多关系：用户点赞世界观
const UserWorldviewLike = sequelize.define('UserWorldviewLike', {}, { timestamps: false });
User.belongsToMany(Worldview, { through: UserWorldviewLike, as: 'likedWorldviews', foreignKey: 'userId' });
Worldview.belongsToMany(User, { through: UserWorldviewLike, as: 'likingUsers', foreignKey: 'worldviewId' });

// 多对多关系：用户点赞评论
const UserCommentLike = sequelize.define('UserCommentLike', {}, { timestamps: false });
User.belongsToMany(Comment, { through: UserCommentLike, as: 'likedComments', foreignKey: 'userId' });
Comment.belongsToMany(User, { through: UserCommentLike, as: 'likingUsers', foreignKey: 'commentId' });



// 通知关联
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });



// 同步数据库
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL 连接成功');
    
    // 使用 alter: true 而不是 force: true，避免删除现有数据
    await sequelize.sync({ alter: true });
    
    console.log('数据库模型同步成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
    // 如果 alter 失败，尝试使用 force: true
    try {
      console.log('尝试使用强制同步模式...');
      await sequelize.sync({ force: true });
      console.log('数据库模型强制同步成功');
    } catch (forceError) {
      console.error('强制同步也失败:', forceError);
      process.exit(1);
    }
  }
};

module.exports = {
  connectDB,
  User,
  Worldview,
  Comment,
  UserWorldviewLike,
  UserCommentLike,
  Notification
};
const { User, Worldview, Comment, UserWorldviewLike, UserCommentLike } = require('../server/models');
const sequelize = require('../server/config/database');

async function checkDatabase() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    // 检查用户数据
    const users = await User.findAll();
    console.log(`=== 用户表 (Users) ===`);
    console.log(`总用户数: ${users.length}`);
    users.forEach(user => {
      console.log(`ID: ${user.id}, 用户名: ${user.username}, 邮箱: ${user.email}, 头像: ${user.avatar || '无'}`);
    });
    console.log('');

    // 检查世界观数据
    const worldviews = await Worldview.findAll();
    console.log(`=== 世界观表 (Worldviews) ===`);
    console.log(`总世界观数: ${worldviews.length}`);
    worldviews.forEach(worldview => {
      console.log(`ID: ${worldview.id}, 标题: ${worldview.title}, 作者ID: ${worldview.authorId}, 编号: ${worldview.worldviewNumber || '无'}`);
    });
    console.log('');

    // 检查评论数据
    const comments = await Comment.findAll();
    console.log(`=== 评论表 (Comments) ===`);
    console.log(`总评论数: ${comments.length}`);
    comments.forEach(comment => {
      console.log(`ID: ${comment.id}, 内容: ${comment.content.substring(0, 30)}..., 作者ID: ${comment.authorId}, 世界观ID: ${comment.worldviewId}`);
    });
    console.log('');

    // 检查用户点赞世界观数据
    const userWorldviewLikes = await UserWorldviewLike.findAll();
    console.log(`=== 用户点赞世界观关联表 (UserWorldviewLike) ===`);
    console.log(`总点赞数: ${userWorldviewLikes.length}`);
    userWorldviewLikes.forEach(like => {
      console.log(`用户ID: ${like.userId}, 世界观ID: ${like.worldviewId}`);
    });
    console.log('');

    // 检查用户点赞评论数据
    const userCommentLikes = await UserCommentLike.findAll();
    console.log(`=== 用户点赞评论关联表 (UserCommentLike) ===`);
    console.log(`总点赞数: ${userCommentLikes.length}`);
    userCommentLikes.forEach(like => {
      console.log(`用户ID: ${like.userId}, 评论ID: ${like.commentId}`);
    });

    // 关闭数据库连接
    await sequelize.close();
  } catch (error) {
    console.error('检查数据库失败:', error);
  }
}

checkDatabase();
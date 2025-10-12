const { User, Worldview, Comment, UserWorldviewLike, UserCommentLike } = require('./server/models');
const sequelize = require('./server/config/database');

async function migrateIds() {
  try {
    console.log('开始迁移ID...');
    
    // 获取所有用户
    const users = await User.findAll();
    
    // 为每个用户分配新的整数ID
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const newId = i + 1;
      
      // 更新用户ID
      await User.update(
        { id: newId },
        { where: { id: user.id } }
      );
      
      // 更新该用户创建的世界观的authorId
      await Worldview.update(
        { authorId: newId },
        { where: { authorId: user.id } }
      );
      
      // 更新该用户的评论的authorId
      await Comment.update(
        { authorId: newId },
        { where: { authorId: user.id } }
      );
      
      // 更新点赞关系中的userId
      await UserWorldviewLike.update(
        { userId: newId },
        { where: { userId: user.id } }
      );
      
      await UserCommentLike.update(
        { userId: newId },
        { where: { userId: user.id } }
      );
      
      console.log(`用户 ${user.username} 的ID已从 ${user.id} 更新为 ${newId}`);
    }
    
    console.log('ID迁移完成！');
  } catch (error) {
    console.error('ID迁移失败:', error);
  } finally {
    await sequelize.close();
  }
}

migrateIds();
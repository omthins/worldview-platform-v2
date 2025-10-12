/**
 * 用户ID迁移脚本
 * 
 * 功能：
 * - 将所有用户ID迁移为连续的整数ID（1, 2, 3, ...）
 * - 更新所有关联表中的用户ID引用
 * - 保持数据完整性
 * 
 * 使用方法：
 * 1. 确保数据库连接正常
 * 2. 运行脚本：node migrate-ids.js
 * 
 * 注意事项：
 * - 此脚本会修改数据库中的用户ID和所有相关引用
 * - 运行前请备份数据库
 * - 确保没有正在运行的应用程序访问数据库
 * - 此操作不可逆，请谨慎执行
 */

// 导入必要的模块
const { User, Worldview, Comment, UserWorldviewLike, UserCommentLike } = require('./server/models');
const sequelize = require('./server/config/database');

/**
 * 主函数：迁移用户ID
 * 将所有用户ID重新分配为连续的整数，并更新所有相关引用
 */
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
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行主函数
migrateIds();
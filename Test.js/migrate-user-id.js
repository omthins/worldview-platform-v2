/**
 * 用户ID迁移脚本：将特定用户的ID修改为新值并迁移所有关联数据
 * 
 * 功能：
 * 1. 查找特定用户并获取其当前ID
 * 2. 查询该用户关联的所有数据（世界观、评论、点赞记录）
 * 3. 在事务中安全地更新用户ID及所有关联数据
 * 4. 通过暂时禁用外键约束解决迁移过程中的约束冲突
 * 
 * 使用方法：
 * 1. 确保已配置好数据库连接（在server/config/database.js中）
 * 2. 在项目根目录运行：node Test.js/migrate-user-id.js
 * 3. 可修改脚本中的username和newUserId变量值来迁移不同用户或使用不同目标ID
 * 
 * 注意事项：
 * - 此脚本会修改数据库，运行前请备份数据库
 * - 脚本使用事务确保数据一致性
 * - 迁移过程中会暂时禁用外键约束，完成后重新启用
 * - 脚本会自动关闭数据库连接
 */

// 导入数据库配置和模型
const sequelize = require('../server/config/database');
const { User, Worldview, Comment } = require('../server/models');

/**
 * 主函数：迁移用户ID及关联数据
 */
async function migrateUserId() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 查找用户omthins
    // 可修改此值迁移其他用户
    const username = 'omthins';
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      console.log(`未找到用户${username}`);
      await sequelize.close();
      return;
    }

    const oldUserId = user.id;
    // 可修改此值使用不同的目标ID
    const newUserId = -1;
    console.log('当前用户ID:', oldUserId);
    console.log('目标用户ID:', newUserId);

    // 查找该用户的世界观
    const worldviews = await Worldview.findAll({
      where: { authorId: oldUserId }
    });

    console.log('该用户的世界观数量:', worldviews.length);

    // 查找该用户的评论
    const comments = await Comment.findAll({
      where: { authorId: oldUserId }
    });

    console.log('该用户的评论数量:', comments.length);

    // 开始事务
    const t = await sequelize.transaction();

    try {
      // 暂时禁用外键约束
      // 这样可以避免在更新过程中出现外键约束错误
      await sequelize.query('SET session_replication_role = replica;', { transaction: t });
      console.log('已禁用外键约束');

      // 首先更新用户ID
      await User.update(
        { id: newUserId },
        { 
          where: { id: oldUserId },
          transaction: t
        }
      );
      console.log(`已更新用户ID从${oldUserId}到${newUserId}`);

      // 然后更新世界观的authorId
      await Worldview.update(
        { authorId: newUserId },
        { 
          where: { authorId: oldUserId },
          transaction: t
        }
      );
      console.log(`已更新世界观的authorId从${oldUserId}到${newUserId}`);

      // 更新评论的authorId
      await Comment.update(
        { authorId: newUserId },
        { 
          where: { authorId: oldUserId },
          transaction: t
        }
      );
      console.log(`已更新评论的authorId从${oldUserId}到${newUserId}`);

      // 更新UserWorldviewLikes表中的userId
      await sequelize.query(
        'UPDATE "UserWorldviewLikes" SET "userId" = :newUserId WHERE "userId" = :oldUserId',
        {
          replacements: { newUserId, oldUserId },
          transaction: t
        }
      );
      console.log(`已更新UserWorldviewLikes中的userId从${oldUserId}到${newUserId}`);

      // 重新启用外键约束
      await sequelize.query('SET session_replication_role = DEFAULT;', { transaction: t });
      console.log('已重新启用外键约束');

      // 提交事务
      await t.commit();
      console.log('数据迁移成功完成');
    } catch (error) {
      // 回滚事务
      await t.rollback();
      console.error('事务失败，已回滚:', error);
    }

    // 关闭数据库连接
    await sequelize.close();
  } catch (error) {
    console.error('迁移失败:', error);
  }
}

// 执行主函数
migrateUserId();
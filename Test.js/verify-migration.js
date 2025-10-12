/**
 * 迁移验证脚本：验证用户ID迁移后的数据一致性
 * 
 * 功能：
 * 1. 查找特定用户并验证其新ID
 * 2. 验证该用户关联的世界观数据是否正确更新
 * 3. 验证该用户关联的评论数据是否正确更新
 * 4. 验证该用户的点赞记录是否正确更新
 * 
 * 使用方法：
 * 1. 确保已配置好数据库连接（在server/config/database.js中）
 * 2. 在项目根目录运行：node Test.js/verify-migration.js
 * 3. 可修改脚本中的username变量值来验证其他用户的迁移结果
 * 
 * 注意事项：
 * - 此脚本用于验证用户ID迁移后的数据一致性
 * - 应在迁移脚本执行后运行此脚本进行验证
 * - 脚本会自动关闭数据库连接
 */

// 导入数据库配置和模型
const sequelize = require('../server/config/database');
const { User, Worldview, Comment } = require('../server/models');

/**
 * 主函数：验证用户ID迁移后的数据一致性
 */
async function verifyMigration() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 查找用户omthins
    // 可修改此值验证其他用户的迁移结果
    const username = 'omthins';
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      console.log(`未找到用户${username}`);
      await sequelize.close();
      return;
    }

    console.log(`用户${username}的新ID:`, user.id);

    // 查找该用户的世界观
    const worldviews = await Worldview.findAll({
      where: { authorId: user.id }
    });

    console.log('该用户的世界观数量:', worldviews.length);
    worldviews.forEach(wv => {
      console.log(`- ${wv.title} (ID: ${wv.id}, authorId: ${wv.authorId})`);
    });

    // 查找该用户的评论
    const comments = await Comment.findAll({
      where: { authorId: user.id }
    });

    console.log('该用户的评论数量:', comments.length);

    // 查询UserWorldviewLikes表中的点赞记录
    const [likeResults] = await sequelize.query(`
      SELECT * FROM "UserWorldviewLikes" 
      WHERE "userId" = :userId;
    `, {
      replacements: { userId: user.id }
    });

    console.log('该用户的点赞记录数量:', likeResults.length);

    // 关闭数据库连接
    await sequelize.close();
  } catch (error) {
    console.error('验证失败:', error);
  }
}

// 执行主函数
verifyMigration();
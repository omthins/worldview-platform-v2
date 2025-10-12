/**
 * 用户数据查询脚本：查找特定用户及其关联数据
 * 
 * 功能：
 * 1. 根据用户名查找用户基本信息（ID、用户名、邮箱）
 * 2. 查找该用户创建的世界观数量
 * 3. 查找该用户发表的评论数量
 * 
 * 使用方法：
 * 1. 确保已配置好数据库连接（在server/config/database.js中）
 * 2. 在项目根目录运行：node Test.js/find-user-data.js
 * 3. 如需查询其他用户，可修改脚本中的username变量值
 * 
 * 注意事项：
 * - 此脚本用于调试用户数据关联关系
 * - 可修改username变量查询不同用户的数据
 * - 脚本会自动关闭数据库连接
 */

// 导入数据库配置和模型
const sequelize = require('../server/config/database');
const { User, Worldview, Comment } = require('../server/models');

/**
 * 主函数：查找用户及其关联数据
 */
async function findUserAndData() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 查找用户omthins
    // 可修改此值查询其他用户
    const username = 'omthins';
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      console.log(`未找到用户${username}`);
      await sequelize.close();
      return;
    }

    console.log('当前用户信息:');
    console.log('ID:', user.id);
    console.log('用户名:', user.username);
    console.log('邮箱:', user.email);

    // 查找该用户的世界观
    const worldviews = await Worldview.findAll({
      where: { authorId: user.id }
    });

    console.log('\n该用户的世界观数量:', worldviews.length);

    // 查找该用户的评论
    const comments = await Comment.findAll({
      where: { authorId: user.id }
    });

    console.log('该用户的评论数量:', comments.length);

    // 关闭数据库连接
    await sequelize.close();
  } catch (error) {
    console.error('查询失败:', error);
  }
}

// 执行主函数
findUserAndData();
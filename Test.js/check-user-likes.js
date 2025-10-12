/**
 * 用户点赞检查脚本：查看UserWorldviewLikes表结构和特定用户的点赞记录
 * 
 * 功能：
 * 1. 查询并显示UserWorldviewLikes表的结构信息（字段名、数据类型、是否可为空）
 * 2. 查询并显示特定用户（默认为用户ID为3）的点赞记录数量
 * 
 * 使用方法：
 * 1. 确保已配置好数据库连接（在server/config/database.js中）
 * 2. 在项目根目录运行：node Test.js/check-user-likes.js
 * 3. 如需查询其他用户的点赞记录，可修改脚本中的userId值
 * 
 * 注意事项：
 * - 此脚本用于调试用户点赞功能
 * - 可修改userId变量查询不同用户的点赞记录
 * - 脚本会自动关闭数据库连接
 */

// 导入数据库配置
const sequelize = require('../server/config/database');

/**
 * 主函数：检查UserWorldviewLikes表结构和用户点赞记录
 */
async function checkUserWorldviewLikes() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 查询UserWorldviewLikes表的结构
    const [results, metadata] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'UserWorldviewLikes'
      ORDER BY ordinal_position;
    `);

    console.log('UserWorldviewLikes表结构:');
    results.forEach(column => {
      console.log(`${column.column_name}: ${column.data_type} (${column.is_nullable})`);
    });

    // 查询用户ID为3的点赞记录
    // 可修改此值查询其他用户的点赞记录
    const userId = 3;
    const [likeResults] = await sequelize.query(`
      SELECT * FROM "UserWorldviewLikes" 
      WHERE "userId" = ${userId};
    `);

    console.log(`\n用户ID为${userId}的点赞记录数量:`, likeResults.length);

    // 关闭数据库连接
    await sequelize.close();
  } catch (error) {
    console.error('查询失败:', error);
  }
}

// 执行主函数
checkUserWorldviewLikes();
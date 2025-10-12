/**
 * 检查系统用户世界观脚本
 * 
 * 功能：
 * - 查找并显示系统用户信息（邮箱为system@worldview.com的用户）
 * - 显示该用户创建的所有世界观，按编号排序
 * 
 * 使用方法：
 * 1. 确保数据库连接正常
 * 2. 运行脚本：node check-system-worldview.js
 * 
 * 注意事项：
 * - 如果系统用户不存在，将显示相应提示
 * - 此脚本仅用于查询，不会修改数据
 */

// 导入必要的模块
const sequelize = require('../server/config/database');
const { User, Worldview } = require('../server/models');

// 系统用户邮箱，可修改为其他邮箱以查询不同用户
const SYSTEM_EMAIL = 'system@worldview.com';

/**
 * 主函数：检查系统用户及其世界观
 */
async function checkSystemWorldview() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 查找系统用户
    const systemUser = await User.findOne({
      where: { email: SYSTEM_EMAIL }
    });

    if (systemUser) {
      console.log('系统用户信息:');
      console.log('ID:', systemUser.id);
      console.log('用户名:', systemUser.username);
      console.log('邮箱:', systemUser.email);

      // 查找该用户的世界观
      const systemWorldviews = await Worldview.findAll({
        where: { authorId: systemUser.id },
        order: [['worldviewNumber', 'ASC']]
      });

      console.log('\n系统用户的世界观:');
      systemWorldviews.forEach(worldview => {
        console.log(`编号: ${worldview.worldviewNumber}`);
        console.log(`标题: ${worldview.title}`);
        console.log(`分类: ${worldview.category}`);
        console.log(`描述: ${worldview.description.substring(0, 50)}...`);
        console.log('---');
      });
    } else {
      console.log(`系统用户不存在 (邮箱: ${SYSTEM_EMAIL})`);
    }

    // 关闭数据库连接
    await sequelize.close();
    console.log('查询完成');
  } catch (error) {
    console.error('查询失败:', error);
  }
}

// 执行主函数
checkSystemWorldview();
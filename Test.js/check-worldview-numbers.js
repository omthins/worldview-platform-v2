/**
 * 检查世界观编号脚本
 * 
 * 功能：
 * - 查询并显示所有世界观的编号信息
 * - 按编号升序排列显示世界观列表
 * 
 * 使用方法：
 * 1. 确保数据库连接正常
 * 2. 运行脚本：node check-worldview-numbers.js
 * 
 * 注意事项：
 * - 此脚本仅用于查询，不会修改数据
 * - 如果世界观没有编号，将显示为null或undefined
 */

// 导入必要的模块
const sequelize = require('./server/config/database');
const Worldview = require('./server/models/worldview');

/**
 * 主函数：检查世界观编号
 */
async function checkWorldviewNumbers() {
  try {
    // 查询所有世界观的ID、标题和编号，按编号升序排列
    const worldviews = await Worldview.findAll({
      attributes: ['id', 'title', 'worldviewNumber'],
      order: [['worldviewNumber', 'ASC']]
    });
    
    console.log('世界观列表:');
    worldviews.forEach(wv => {
      console.log(`ID: ${wv.id}, 标题: ${wv.title}, 编号: ${wv.worldviewNumber}`);
    });
  } catch (error) {
    console.error('查询世界观时出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行主函数
checkWorldviewNumbers();
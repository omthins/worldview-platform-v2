/**
 * 更新世界观编号脚本
 * 
 * 功能：
 * - 为数据库中的所有世界观按创建时间顺序分配编号
 * - 编号从1开始，按照创建时间升序排列
 * 
 * 使用方法：
 * 1. 确保数据库连接正常
 * 2. 运行脚本：node update-worldview-numbers.js
 * 
 * 注意事项：
 * - 此脚本会修改数据库中的世界观记录
 * - 建议在执行前备份数据库
 * - 执行过程中不要中断，否则可能导致编号不连续
 */

// 导入必要的模块
const sequelize = require('./server/config/database');
const Worldview = require('./server/models/worldview');

/**
 * 主函数：更新世界观编号
 * 按照创建时间顺序为所有世界观分配连续编号
 */
async function updateWorldviewNumbers() {
  try {
    console.log('开始更新世界观编号...');
    
    // 获取所有世界观，按创建时间排序
    const worldviews = await Worldview.findAll({
      order: [['createdAt', 'ASC']]
    });
    
    console.log(`找到 ${worldviews.length} 个世界观`);
    
    // 为每个世界观分配编号
    for (let i = 0; i < worldviews.length; i++) {
      const worldview = worldviews[i];
      const worldviewNumber = i + 1; // 编号从1开始
      
      await worldview.update({ worldviewNumber });
      console.log(`已更新世界观 "${worldview.title}" 的编号为 ${worldviewNumber}`);
    }
    
    console.log('所有世界观编号更新完成！');
  } catch (error) {
    console.error('更新世界观编号时出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行主函数
updateWorldviewNumbers();
const sequelize = require('./server/config/database');
const Worldview = require('./server/models/Worldview');

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
    await sequelize.close();
  }
}

updateWorldviewNumbers();
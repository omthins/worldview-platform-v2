const sequelize = require('./server/config/database');
const Worldview = require('./server/models/Worldview');

async function checkWorldviewNumbers() {
  try {
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
    await sequelize.close();
  }
}

checkWorldviewNumbers();
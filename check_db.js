const { Worldview } = require('./server/models');

(async () => {
  try {
    const worldviews = await Worldview.findAll({
      attributes: ['id', 'title', 'coverImage', 'worldviewNumber'],
      limit: 5
    });
    
    console.log('数据库中的世界观:');
    worldviews.forEach(w => {
      console.log(`ID: ${w.id}, 标题: ${w.title}, 封面图片: ${w.coverImage}, 编号: ${w.worldviewNumber}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('查询错误:', error);
    process.exit(1);
  }
})();
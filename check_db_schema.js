const sequelize = require('./server/config/database');

async function checkDatabaseSchema() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 查询Users表的结构
    const [results, metadata] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Users表结构:');
    console.table(results);
    
    // 检查表是否存在
    const [tableResults] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'Users';
    `);
    
    if (tableResults.length === 0) {
      console.log('Users表不存在，需要创建');
    } else {
      console.log('Users表已存在');
    }
    
  } catch (error) {
    console.error('检查数据库结构时出错:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabaseSchema();
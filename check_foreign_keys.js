const sequelize = require('./server/config/database');

async function checkForeignKeys() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 查询所有外键约束
    const [results] = await sequelize.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND ccu.table_name = 'Users';
    `);
    
    console.log('引用Users表的外键约束:');
    console.table(results);
    
  } catch (error) {
    console.error('检查外键约束时出错:', error);
  } finally {
    await sequelize.close();
  }
}

checkForeignKeys();
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'worldview_platform',
  password: 'mc114514',
  port: 5432,
});

async function listTables() {
  try {
    await client.connect();
    console.log('数据库连接成功');

    // 列出所有表
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n数据库中的所有表:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

  } catch (error) {
    console.error('查询表列表失败:', error);
  } finally {
    await client.end();
  }
}

listTables();
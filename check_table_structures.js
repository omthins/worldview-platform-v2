const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'worldview_platform',
  password: 'mc114514',
  port: 5432,
});

async function checkTableStructures() {
  try {
    await client.connect();
    console.log('数据库连接成功');

    // 检查Users表结构
    const usersResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'Users' 
      ORDER BY ordinal_position;
    `);
    console.log('\nUsers表结构:');
    usersResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
    });

    // 检查Worldviews表结构
    const worldviewsResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'Worldviews' 
      ORDER BY ordinal_position;
    `);
    console.log('\nWorldviews表结构:');
    worldviewsResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
    });

    // 检查Comments表结构
    const commentsResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'Comments' 
      ORDER BY ordinal_position;
    `);
    console.log('\nComments表结构:');
    commentsResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
    });

    // 检查UserWorldviewLikes表结构
    const userWorldviewLikesResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'UserWorldviewLikes' 
      ORDER BY ordinal_position;
    `);
    console.log('\nUserWorldviewLikes表结构:');
    userWorldviewLikesResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
    });

    // 检查UserCommentLikes表结构
    const userCommentLikesResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'UserCommentLikes' 
      ORDER BY ordinal_position;
    `);
    console.log('\nUserCommentLikes表结构:');
    userCommentLikesResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
    });

    // 检查外键约束
    const foreignKeysResult = await client.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND (tc.table_name IN ('Users', 'Worldviews', 'Comments', 'UserWorldviewLikes', 'UserCommentLikes'))
      ORDER BY tc.table_name;
    `);
    console.log('\n外键约束:');
    foreignKeysResult.rows.forEach(row => {
      console.log(`- ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name} (${row.constraint_name})`);
    });

  } catch (error) {
    console.error('查询表结构失败:', error);
  } finally {
    await client.end();
  }
}

checkTableStructures();
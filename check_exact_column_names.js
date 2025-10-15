const sequelize = require('./server/config/database');

async function checkExactColumnNames() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 检查UserWorldviewLikes表的确切列名
    const userWorldviewLikes = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'UserWorldviewLikes' AND column_name ILIKE '%userid%';
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('\nUserWorldviewLikes表中与用户ID相关的列:');
    userWorldviewLikes.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });
    
    // 检查UserCommentLikes表的确切列名
    const userCommentLikes = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'UserCommentLikes' AND column_name ILIKE '%userid%';
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('\nUserCommentLikes表中与用户ID相关的列:');
    userCommentLikes.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });
    
    // 检查Comments表的确切列名
    const comments = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Comments' AND column_name ILIKE '%authorid%';
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('\nComments表中与作者ID相关的列:');
    comments.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });
    
    // 检查Worldviews表的确切列名
    const worldviews = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Worldviews' AND column_name ILIKE '%authorid%';
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('\nWorldviews表中与作者ID相关的列:');
    worldviews.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });
    
  } catch (error) {
    console.error('检查列名时出错:', error);
  } finally {
    await sequelize.close();
  }
}

checkExactColumnNames();
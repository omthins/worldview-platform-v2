const sequelize = require('./server/config/database');

async function addWorldviewNumberColumn() {
  try {
    console.log('开始添加worldviewNumber字段...');
    
    // 添加worldviewNumber字段到Worldviews表
    await sequelize.getQueryInterface().addColumn('Worldviews', 'worldviewNumber', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      defaultValue: 0
    });
    
    console.log('worldviewNumber字段添加成功！');
    
    // 现在更新所有现有记录的worldviewNumber
    const [results] = await sequelize.query(`
      UPDATE "Worldviews" 
      SET "worldviewNumber" = temp.row_number
      FROM (
        SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt") AS row_number
        FROM "Worldviews"
      ) AS temp
      WHERE "Worldviews"."id" = temp."id"
    `);
    
    console.log(`已更新 ${results[1]} 条记录的worldviewNumber`);
    
  } catch (error) {
    console.error('添加worldviewNumber字段时出错:', error);
  } finally {
    await sequelize.close();
  }
}

addWorldviewNumberColumn();
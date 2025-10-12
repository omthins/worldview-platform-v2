const sequelize = require('./server/config/database');

async function addWorldviewNumberColumn() {
  try {
    console.log('开始添加worldviewNumber字段...');
    
    // 先添加worldviewNumber字段到Worldviews表（不设置唯一约束）
    await sequelize.getQueryInterface().addColumn('Worldviews', 'worldviewNumber', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
    
    console.log('worldviewNumber字段添加成功！');
    
    // 更新所有现有记录的worldviewNumber
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
    
    // 现在将字段设置为NOT NULL
    await sequelize.getQueryInterface().changeColumn('Worldviews', 'worldviewNumber', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false
    });
    
    console.log('worldviewNumber字段设置为NOT NULL成功！');
    
    // 最后添加唯一约束
    await sequelize.getQueryInterface().addConstraint('Worldviews', {
      fields: ['worldviewNumber'],
      type: 'unique',
      name: 'worldviews_worldviewNumber_unique'
    });
    
    console.log('worldviewNumber字段唯一约束添加成功！');
    
  } catch (error) {
    console.error('添加worldviewNumber字段时出错:', error);
  } finally {
    await sequelize.close();
  }
}

addWorldviewNumberColumn();
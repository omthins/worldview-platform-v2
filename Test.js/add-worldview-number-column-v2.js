/**
 * 数据库迁移脚本：为Worldviews表添加worldviewNumber字段（改进版）
 * 
 * 功能：
 * 1. 在Worldviews表中添加worldviewNumber字段（整数类型，唯一，非空）
 * 2. 为现有记录按创建时间顺序分配worldviewNumber值
 * 
 * 与原版本的区别：
 * - 采用更安全的迁移策略：先添加可为空的字段，填充数据后再设置非空和唯一约束
 * - 适用于已有大量数据的表，避免迁移过程中的数据冲突
 * 
 * 使用方法：
 * 1. 确保已配置好数据库连接（在server/config/database.js中）
 * 2. 在项目根目录运行：node Test.js/add-worldview-number-column-v2.js
 * 
 * 注意事项：
 * - 此脚本只需运行一次
 * - 运行前请备份数据库
 * - 如果字段已存在，脚本会报错
 * - 推荐在生产环境使用此版本而非原版本
 */

// 导入数据库配置
const sequelize = require('./server/config/database');

/**
 * 主函数：添加worldviewNumber字段并初始化数据
 * 采用分步骤的安全迁移策略
 */
async function addWorldviewNumberColumn() {
  try {
    console.log('开始添加worldviewNumber字段...');
    
    // 步骤1：先添加worldviewNumber字段到Worldviews表（不设置唯一约束，允许为空）
    // 这样可以避免在添加字段时立即与现有数据产生冲突
    await sequelize.getQueryInterface().addColumn('Worldviews', 'worldviewNumber', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
    
    console.log('worldviewNumber字段添加成功！');
    
    // 步骤2：更新所有现有记录的worldviewNumber
    // 按创建时间顺序分配编号（1, 2, 3, ...）
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
    
    // 步骤3：将字段设置为NOT NULL
    // 现在所有记录都有值，可以安全地设置为非空
    await sequelize.getQueryInterface().changeColumn('Worldviews', 'worldviewNumber', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false
    });
    
    console.log('worldviewNumber字段设置为NOT NULL成功！');
    
    // 步骤4：最后添加唯一约束
    // 确保worldviewNumber值唯一
    await sequelize.getQueryInterface().addConstraint('Worldviews', {
      fields: ['worldviewNumber'],
      type: 'unique',
      name: 'worldviews_worldviewNumber_unique'
    });
    
    console.log('worldviewNumber字段唯一约束添加成功！');
    
  } catch (error) {
    console.error('添加worldviewNumber字段时出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行主函数
addWorldviewNumberColumn();
/**
 * 数据库迁移脚本：为Worldviews表添加worldviewNumber字段
 * 
 * 功能：
 * 1. 在Worldviews表中添加worldviewNumber字段（整数类型，唯一，非空）
 * 2. 为现有记录按创建时间顺序分配worldviewNumber值
 * 
 * 使用方法：
 * 1. 确保已配置好数据库连接（在server/config/database.js中）
 * 2. 在项目根目录运行：node Test.js/add-worldview-number-column.js
 * 
 * 注意事项：
 * - 此脚本只需运行一次
 * - 运行前请备份数据库
 * - 如果字段已存在，脚本会报错
 */

// 导入数据库配置
const sequelize = require('./server/config/database');

/**
 * 主函数：添加worldviewNumber字段并初始化数据
 */
async function addWorldviewNumberColumn() {
  try {
    console.log('开始添加worldviewNumber字段...');
    
    // 添加worldviewNumber字段到Worldviews表
    // 字段属性：整数类型、不允许为空、唯一、默认值为0
    await sequelize.getQueryInterface().addColumn('Worldviews', 'worldviewNumber', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      defaultValue: 0
    });
    
    console.log('worldviewNumber字段添加成功！');
    
    // 更新所有现有记录的worldviewNumber
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
    
  } catch (error) {
    console.error('添加worldviewNumber字段时出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行主函数
addWorldviewNumberColumn();
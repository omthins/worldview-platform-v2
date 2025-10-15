const sequelize = require('./server/config/database');

async function fixUserIdTypeSimple() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 1. 删除所有引用Users表的外键约束
      await sequelize.query(`ALTER TABLE "UserWorldviewLikes" DROP CONSTRAINT IF EXISTS "UserWorldviewLikes_userId_fkey";`, { transaction });
      await sequelize.query(`ALTER TABLE "UserCommentLikes" DROP CONSTRAINT IF EXISTS "UserCommentLikes_userId_fkey";`, { transaction });
      await sequelize.query(`ALTER TABLE "Comments" DROP CONSTRAINT IF EXISTS "Comments_authorId_fkey";`, { transaction });
      await sequelize.query(`ALTER TABLE "Worldviews" DROP CONSTRAINT IF EXISTS "Worldviews_authorId_fkey";`, { transaction });
      
      // 2. 先删除id字段的默认值
      await sequelize.query(`
        ALTER TABLE "Users" 
        ALTER COLUMN "id" DROP DEFAULT;
      `, { transaction });
      
      // 3. 删除自增序列
      await sequelize.query(`DROP SEQUENCE IF EXISTS users_id_seq;`, { transaction });
      
      // 4. 修改id字段类型为varchar
      await sequelize.query(`
        ALTER TABLE "Users" 
        ALTER COLUMN "id" TYPE VARCHAR(255) USING id::VARCHAR(255);
      `, { transaction });
      
      // 提交事务
      await transaction.commit();
      console.log('成功修改Users表的id字段类型为VARCHAR');
      
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('修改数据库表结构时出错:', error);
  } finally {
    await sequelize.close();
  }
}

fixUserIdTypeSimple();
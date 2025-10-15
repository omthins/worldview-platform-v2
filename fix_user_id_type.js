const sequelize = require('./server/config/database');

async function fixUserIdType() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 1. 删除所有引用Users表的外键约束
      await sequelize.query(`ALTER TABLE "UserWorldviewLikes" DROP CONSTRAINT "UserWorldviewLikes_userId_fkey";`, { transaction });
      await sequelize.query(`ALTER TABLE "UserCommentLikes" DROP CONSTRAINT "UserCommentLikes_userId_fkey";`, { transaction });
      await sequelize.query(`ALTER TABLE "Comments" DROP CONSTRAINT "Comments_authorId_fkey";`, { transaction });
      await sequelize.query(`ALTER TABLE "Worldviews" DROP CONSTRAINT "Worldviews_authorId_fkey";`, { transaction });
      
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
      
      // 5. 修改所有引用表的外键字段类型
      await sequelize.query(`
        ALTER TABLE "UserWorldviewLikes" 
        ALTER COLUMN "userId" TYPE VARCHAR(255) USING userId::VARCHAR(255);
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE "UserCommentLikes" 
        ALTER COLUMN "userId" TYPE VARCHAR(255) USING userId::VARCHAR(255);
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE "Comments" 
        ALTER COLUMN "authorId" TYPE VARCHAR(255) USING authorId::VARCHAR(255);
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE "Worldviews" 
        ALTER COLUMN "authorId" TYPE VARCHAR(255) USING authorId::VARCHAR(255);
      `, { transaction });
      
      // 6. 重新创建外键约束
      await sequelize.query(`
        ALTER TABLE "UserWorldviewLikes" 
        ADD CONSTRAINT "UserWorldviewLikes_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "Users" ("id");
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE "UserCommentLikes" 
        ADD CONSTRAINT "UserCommentLikes_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "Users" ("id");
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE "Comments" 
        ADD CONSTRAINT "Comments_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "Users" ("id");
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE "Worldviews" 
        ADD CONSTRAINT "Worldviews_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "Users" ("id");
      `, { transaction });
      
      // 提交事务
      await transaction.commit();
      console.log('成功修改Users表的id字段类型为VARCHAR并更新了所有相关外键');
      
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

fixUserIdType();
const sequelize = require('./server/config/database');

async function fixForeignKeyTypes() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 1. 修改Worldviews表的authorId字段类型
      await sequelize.query(`
        ALTER TABLE "Worldviews" 
        ALTER COLUMN "authorId" TYPE VARCHAR(255) USING authorId::VARCHAR(255);
      `, { transaction });
      
      // 2. 修改Comments表的authorId字段类型
      await sequelize.query(`
        ALTER TABLE "Comments" 
        ALTER COLUMN "authorId" TYPE VARCHAR(255) USING authorId::VARCHAR(255);
      `, { transaction });
      
      // 3. 修改UserWorldviewLikes表的userId字段类型
      await sequelize.query(`
        ALTER TABLE "UserWorldviewLikes" 
        ALTER COLUMN "userId" TYPE VARCHAR(255) USING userId::VARCHAR(255);
      `, { transaction });
      
      // 4. 修改UserCommentLikes表的userId字段类型
      await sequelize.query(`
        ALTER TABLE "UserCommentLikes" 
        ALTER COLUMN "userId" TYPE VARCHAR(255) USING userId::VARCHAR(255);
      `, { transaction });
      
      // 5. 重新创建外键约束
      await sequelize.query(`
        ALTER TABLE "Worldviews" 
        ADD CONSTRAINT "Worldviews_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "Users" ("id");
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE "Comments" 
        ADD CONSTRAINT "Comments_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "Users" ("id");
      `, { transaction });
      
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
      
      // 提交事务
      await transaction.commit();
      console.log('成功修改所有外键字段类型为VARCHAR并重新创建外键约束');
      
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('修改外键字段类型时出错:', error);
  } finally {
    await sequelize.close();
  }
}

fixForeignKeyTypes();
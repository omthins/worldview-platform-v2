const { Sequelize } = require('sequelize');

// 创建数据库连接
const sequelize = new Sequelize(
  process.env.DB_NAME || 'worldview_platform',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'mc114514',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
  }
);

async function migrateIds() {
  try {
    console.log('开始迁移ID...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 开始事务
    const transaction = await sequelize.transaction();
    
    try {
      // 1. 为Users表添加新的整数ID列
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN "newId" INTEGER
    `, { transaction });

    // 为newId列创建序列
    await sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS users_newid_seq
    `, { transaction });

    // 设置newId的默认值
    await sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "newId" SET DEFAULT nextval('users_newid_seq')
    `, { transaction });

    // 为newId列添加主键约束（先删除旧主键）
    await sequelize.query(`
      ALTER TABLE "Users" 
      DROP CONSTRAINT IF EXISTS "Users_pkey" CASCADE
    `, { transaction });

    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD CONSTRAINT users_newid_pkey PRIMARY KEY ("newId")
    `, { transaction });
      
      // 2. 为Worldviews表添加新的整数authorId列
    await sequelize.query(`
      ALTER TABLE "Worldviews" 
      ADD COLUMN "newAuthorId" INTEGER
    `, { transaction });
      
      // 3. 为Comments表添加新的整数authorId列
    await sequelize.query(`
      ALTER TABLE "Comments" 
      ADD COLUMN "newAuthorId" INTEGER
    `, { transaction });
      
      // 4. 为UserWorldviewLike表添加新的整数userId列
    await sequelize.query(`
      ALTER TABLE "UserWorldviewLikes" 
      ADD COLUMN "newUserId" INTEGER
    `, { transaction });
      
      // 5. 为UserCommentLike表添加新的整数userId列
    await sequelize.query(`
      ALTER TABLE "UserCommentLikes" 
      ADD COLUMN "newUserId" INTEGER
    `, { transaction });
      
      // 提交事务
      await transaction.commit();
      console.log('已添加新列，开始填充数据...');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
    // 6. 填充数据
    const fillTransaction = await sequelize.transaction();
    try {
      // 获取所有用户
      const users = await sequelize.query('SELECT * FROM "Users"', { 
        type: Sequelize.QueryTypes.SELECT,
        transaction: fillTransaction 
      });
      
      console.log(`找到 ${users.length} 个用户`);
      
      // 为每个用户分配新的整数ID
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const newId = i + 1;
        
        // 更新用户表
        await sequelize.query(`
          UPDATE "Users" 
          SET "newId" = :newId 
          WHERE "id" = :oldId
        `, {
          replacements: { newId, oldId: user.id },
          transaction: fillTransaction
        });
        
        // 更新世界观表
        await sequelize.query(`
          UPDATE "Worldviews" 
          SET "newAuthorId" = :newId 
          WHERE "authorId" = :oldId
        `, {
          replacements: { newId, oldId: user.id },
          transaction: fillTransaction
        });
        
        // 更新评论表
        await sequelize.query(`
          UPDATE "Comments" 
          SET "newAuthorId" = :newId 
          WHERE "authorId" = :oldId
        `, {
          replacements: { newId, oldId: user.id },
          transaction: fillTransaction
        });
        
        // 更新用户点赞表
        await sequelize.query(`
          UPDATE "UserWorldviewLikes" 
          SET "newUserId" = :newId 
          WHERE "userId" = :oldId
        `, {
          replacements: { newId, oldId: user.id },
          transaction: fillTransaction
        });
        
        // 更新评论点赞表
        await sequelize.query(`
          UPDATE "UserCommentLikes" 
          SET "newUserId" = :newId 
          WHERE "userId" = :oldId
        `, {
          replacements: { newId, oldId: user.id },
          transaction: fillTransaction
        });
      }
      
      await fillTransaction.commit();
      console.log('数据填充完成');
    } catch (error) {
      await fillTransaction.rollback();
      throw error;
    }
    
    // 7. 删除旧列并重命名新列
    const renameTransaction = await sequelize.transaction();
    
    try {
      // 删除旧的外键约束
      await sequelize.query(`
        ALTER TABLE "Worldviews" DROP CONSTRAINT IF EXISTS "Worldviews_authorId_fkey"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "Comments" DROP CONSTRAINT IF EXISTS "Comments_authorId_fkey"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "UserWorldviewLikes" DROP CONSTRAINT IF EXISTS "UserWorldviewLikes_userId_fkey"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "UserCommentLikes" DROP CONSTRAINT IF EXISTS "UserCommentLikes_userId_fkey"
      `, { transaction: renameTransaction });
      
      // 删除旧的主键约束
      await sequelize.query(`
        ALTER TABLE "Users" DROP CONSTRAINT IF EXISTS "Users_pkey"
      `, { transaction: renameTransaction });
      
      // 删除旧列
      await sequelize.query(`
        ALTER TABLE "Users" DROP COLUMN IF EXISTS id
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "Worldviews" DROP COLUMN IF EXISTS "authorId"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "Comments" DROP COLUMN IF EXISTS "authorId"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "UserWorldviewLikes" DROP COLUMN IF EXISTS "userId"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "UserCommentLikes" DROP COLUMN IF EXISTS "userId"
      `, { transaction: renameTransaction });
      
      // 重命名新列
      await sequelize.query(`
        ALTER TABLE "Users" RENAME COLUMN "newId" TO id
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "Worldviews" RENAME COLUMN "newAuthorId" TO "authorId"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "Comments" RENAME COLUMN "newAuthorId" TO "authorId"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "UserWorldviewLikes" RENAME COLUMN "newUserId" TO "userId"
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "UserCommentLikes" RENAME COLUMN "newUserId" TO "userId"
      `, { transaction: renameTransaction });
      
      // 重新添加主键约束
      await sequelize.query(`
        ALTER TABLE "Users" ADD PRIMARY KEY (id)
      `, { transaction: renameTransaction });
      
      // 重新添加外键约束
      await sequelize.query(`
        ALTER TABLE "Worldviews" ADD CONSTRAINT "Worldviews_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "Users" (id) ON DELETE CASCADE
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "Users" (id) ON DELETE CASCADE
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "UserWorldviewLikes" ADD CONSTRAINT "UserWorldviewLikes_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "Users" (id) ON DELETE CASCADE
      `, { transaction: renameTransaction });
      
      await sequelize.query(`
        ALTER TABLE "UserCommentLikes" ADD CONSTRAINT "UserCommentLikes_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "Users" (id) ON DELETE CASCADE
      `, { transaction: renameTransaction });
      
      // 提交事务
      await renameTransaction.commit();
      console.log('成功重命名列并添加约束');
    } catch (error) {
      await renameTransaction.rollback();
      throw error;
    }
    
    console.log('ID迁移完成！');
  } catch (error) {
    console.error('ID迁移失败:', error);
  } finally {
    await sequelize.close();
  }
}

migrateIds();
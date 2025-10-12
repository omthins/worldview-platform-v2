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
      // 1. 为Users表添加新的整数ID列（允许NULL）
      await sequelize.query(`
        ALTER TABLE "Users" 
        ADD COLUMN "newId" INTEGER
      `, { transaction });
      
      console.log('已添加newId列');
      
      // 2. 获取所有用户
      const users = await sequelize.query('SELECT id FROM "Users" ORDER BY "createdAt"', { 
        type: Sequelize.QueryTypes.SELECT,
        transaction: transaction 
      });
      
      console.log(`找到 ${users.length} 个用户`);
      
      // 3. 为每个用户分配新的整数ID
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
          transaction: transaction
        });
      }
      
      console.log('已填充用户newId数据');
      
      // 4. 为newId列添加主键约束（先删除旧主键）
      await sequelize.query(`
        ALTER TABLE "Users" 
        DROP CONSTRAINT IF EXISTS "Users_pkey" CASCADE
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE "Users" 
        ADD CONSTRAINT users_newid_pkey PRIMARY KEY ("newId")
      `, { transaction });
      
      console.log('已设置newId为主键');
      
      // 5. 为Worldviews表添加新的整数authorId列
      await sequelize.query(`
        ALTER TABLE "Worldviews" 
        ADD COLUMN "newAuthorId" INTEGER
      `, { transaction });
      
      // 6. 填充Worldviews表的newAuthorId
      await sequelize.query(`
        UPDATE "Worldviews" w
        SET "newAuthorId" = u."newId"
        FROM "Users" u
        WHERE w."authorId" = u.id
      `, { transaction });
      
      console.log('已填充Worldviews表的newAuthorId');
      
      // 7. 为Comments表添加新的整数authorId列
      await sequelize.query(`
        ALTER TABLE "Comments" 
        ADD COLUMN "newAuthorId" INTEGER
      `, { transaction });
      
      // 8. 填充Comments表的newAuthorId
      await sequelize.query(`
        UPDATE "Comments" c
        SET "newAuthorId" = u."newId"
        FROM "Users" u
        WHERE c."authorId" = u.id
      `, { transaction });
      
      console.log('已填充Comments表的newAuthorId');
      
      // 9. 为UserWorldviewLikes表添加新的整数userId列
      await sequelize.query(`
        ALTER TABLE "UserWorldviewLikes" 
        ADD COLUMN "newUserId" INTEGER
      `, { transaction });
      
      // 10. 填充UserWorldviewLikes表的newUserId
      await sequelize.query(`
        UPDATE "UserWorldviewLikes" uwl
        SET "newUserId" = u."newId"
        FROM "Users" u
        WHERE uwl."userId" = u.id
      `, { transaction });
      
      console.log('已填充UserWorldviewLikes表的newUserId');
      
      // 11. 为UserCommentLikes表添加新的整数userId列
      await sequelize.query(`
        ALTER TABLE "UserCommentLikes" 
        ADD COLUMN "newUserId" INTEGER
      `, { transaction });
      
      // 12. 填充UserCommentLikes表的newUserId
      await sequelize.query(`
        UPDATE "UserCommentLikes" ucl
        SET "newUserId" = u."newId"
        FROM "Users" u
        WHERE ucl."userId" = u.id
      `, { transaction });
      
      console.log('已填充UserCommentLikes表的newUserId');
      
      // 提交事务
      await transaction.commit();
      console.log('第一阶段完成：添加新列并填充数据');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
    // 第二阶段：删除旧列并重命名新列
    const renameTransaction = await sequelize.transaction();
    
    try {
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
      console.log('第二阶段完成：删除旧列并重命名新列');
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
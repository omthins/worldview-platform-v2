// 公开所有世界观脚本
// 此脚本将数据库中所有非公开的世界观设置为公开状态

const { Sequelize, DataTypes } = require('sequelize');

// 初始化Sequelize连接（与服务器端保持一致）
const sequelize = new Sequelize(
  process.env.DB_NAME || 'worldview_platform',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'mc114514',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log
  }
);

// 定义Worldview模型（与服务器端保持一致）
const Worldview = sequelize.define('Worldview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Worldviews'
});

async function publishAllWorldviews() {
  try {
    console.log('开始连接数据库...');
    await sequelize.authenticate();
    console.log('✓ 数据库连接成功');

    // 同步模型
    await sequelize.sync();
    console.log('✓ 数据库模型同步成功');

    // 查询所有非公开的世界观
    console.log('\n正在查询所有非公开的世界观...');
    const privateWorldviews = await Worldview.findAll({
      where: {
        isPublic: false
      }
    });

    if (privateWorldviews.length === 0) {
      console.log('✓ 没有找到非公开的世界观，所有世界观已经是公开状态');
      return;
    }

    console.log(`找到 ${privateWorldviews.length} 个非公开的世界观:`);
    privateWorldviews.forEach((worldview, index) => {
      console.log(`${index + 1}. ID: ${worldview.id}, 标题: ${worldview.title}, 作者ID: ${worldview.authorId}`);
    });

    // 确认操作
    console.log('\n即将把这些世界观设置为公开状态...');
    
    // 将所有非公开的世界观设置为公开
    const [updatedCount] = await Worldview.update(
      { isPublic: true },
      {
        where: {
          isPublic: false
        }
      }
    );

    console.log(`✓ 成功将 ${updatedCount} 个世界观设置为公开状态`);

    // 验证结果
    console.log('\n验证结果...');
    const remainingPrivateWorldviews = await Worldview.findAll({
      where: {
        isPublic: false
      }
    });

    if (remainingPrivateWorldviews.length === 0) {
      console.log('✓ 验证成功：所有世界观现在都是公开状态');
    } else {
      console.log(`⚠ 验证失败：仍有 ${remainingPrivateWorldviews.length} 个世界观保持非公开状态`);
    }

    // 查询总世界观数量
    const totalWorldviews = await Worldview.count();
    const publicWorldviews = await Worldview.count({
      where: {
        isPublic: true
      }
    });

    console.log(`\n统计信息:`);
    console.log(`总世界观数量: ${totalWorldviews}`);
    console.log(`公开世界观数量: ${publicWorldviews}`);
    console.log(`非公开世界观数量: ${totalWorldviews - publicWorldviews}`);

  } catch (error) {
    console.error('操作过程中出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    console.log('\n数据库连接已关闭');
  }
}

// 运行脚本
console.log('===== 公开所有世界观脚本 =====');
publishAllWorldviews();
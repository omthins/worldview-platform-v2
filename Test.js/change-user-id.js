const { Sequelize } = require('sequelize');
const readline = require('readline');

// 初始化Sequelize连接
const sequelize = new Sequelize(
  process.env.DB_NAME || 'worldview_platform',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'mc114514',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

// 定义User模型
const { DataTypes } = require('sequelize');
const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// 定义Worldview模型
const Worldview = sequelize.define('Worldview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// 定义Comment模型
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  worldviewId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// 定义UserWorldviewLike模型
const UserWorldviewLike = sequelize.define('UserWorldviewLike', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  worldviewId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// 定义UserCommentLike模型
const UserCommentLike = sequelize.define('UserCommentLike', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// 创建readline接口用于控制台交互
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 询问用户输入
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// 列出所有用户
async function listUsers() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email']
    });
    
    console.log('\n数据库中的用户列表:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, 用户名: ${user.username}, 邮箱: ${user.email}`);
    });
    
    return users;
  } catch (error) {
    console.error('获取用户列表时出错:', error);
    return [];
  }
}

// 更改用户ID并迁移数据
async function changeUserId() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 同步模型
    await sequelize.sync();
    
    // 列出所有用户
    const users = await listUsers();
    
    if (users.length === 0) {
      console.log('数据库中没有用户');
      rl.close();
      return;
    }
    
    // 获取要更改的用户ID
    let oldUserId;
    while (true) {
      oldUserId = await askQuestion('\n请输入要更改的用户ID: ');
      
      // 验证输入是否为有效的ID (字母和数字的组合，至少1个字符)
      if (!/^[a-zA-Z0-9]+$/.test(oldUserId)) {
        console.log('错误: 用户ID只能包含字母和数字，请重新输入');
        continue;
      }
      
      break;
    }
    const user = await User.findByPk(oldUserId);
    
    if (!user) {
      console.log(`未找到ID为 ${oldUserId} 的用户`);
      rl.close();
      return;
    }
    
    console.log(`找到用户: ${user.username} (ID: ${oldUserId})`);
    
    // 获取新的用户ID
    let newUserId;
    while (true) {
      const newUserIdInput = await askQuestion('请输入新的用户ID (可以是字母和数字的组合): ');
      
      // 验证输入是否为有效的ID (字母和数字的组合，至少1个字符)
      if (!/^[a-zA-Z0-9]+$/.test(newUserIdInput)) {
        console.log('错误: 用户ID只能包含字母和数字，请重新输入');
        continue;
      }
      
      newUserId = newUserIdInput;
      break;
    }
    
    // 检查新ID是否已存在
    const existingUser = await User.findByPk(newUserId);
    if (existingUser) {
      console.log(`ID ${newUserId} 已被用户 ${existingUser.username} 使用`);
      
      const confirm = await askQuestion('是否要合并这两个用户的所有数据? (y/n): ');
      if (confirm.toLowerCase() !== 'y') {
        console.log('操作已取消');
        rl.close();
        return;
      }
      
      // 合并用户数据
      await mergeUserData(oldUserId, newUserId);
      
      // 删除旧用户
      await User.destroy({ where: { id: oldUserId } });
      
      console.log(`用户 ${user.username} (ID: ${oldUserId}) 已删除，其数据已合并到用户 ${existingUser.username} (ID: ${newUserId})`);
    } else {
      // 更改用户ID
      await updateUserId(oldUserId, newUserId);
      console.log(`用户 ${user.username} 的ID已从 ${oldUserId} 更改为 ${newUserId}`);
    }
    
    // 关闭数据库连接
    await sequelize.close();
    console.log('数据库连接已关闭');
    rl.close();
    
  } catch (error) {
    console.error('更改用户ID时出错:', error);
    rl.close();
    process.exit(1);
  }
}

// 更新用户ID
async function updateUserId(oldId, newId) {
  // 开始事务
  const transaction = await sequelize.transaction();
  
  try {
    // 更新Worldviews表中的userId
    await Worldview.update(
      { userId: newId },
      { where: { userId: oldId }, transaction }
    );
    
    // 更新Comments表中的userId
    await Comment.update(
      { userId: newId },
      { where: { userId: oldId }, transaction }
    );
    
    // 更新UserWorldviewLikes表中的userId
    await UserWorldviewLike.update(
      { userId: newId },
      { where: { userId: oldId }, transaction }
    );
    
    // 更新UserCommentLikes表中的userId
    await UserCommentLike.update(
      { userId: newId },
      { where: { userId: oldId }, transaction }
    );
    
    // 更新User表中的ID
    await User.update(
      { id: newId },
      { where: { id: oldId }, transaction }
    );
    
    // 提交事务
    await transaction.commit();
    
    console.log('用户ID更新成功');
  } catch (error) {
    // 回滚事务
    await transaction.rollback();
    throw error;
  }
}

// 合并用户数据
async function mergeUserData(oldId, newId) {
  // 开始事务
  const transaction = await sequelize.transaction();
  
  try {
    // 更新Worldviews表中的userId
    await Worldview.update(
      { userId: newId },
      { where: { userId: oldId }, transaction }
    );
    
    // 更新Comments表中的userId
    await Comment.update(
      { userId: newId },
      { where: { userId: oldId }, transaction }
    );
    
    // 更新UserWorldviewLikes表中的userId
    await UserWorldviewLike.update(
      { userId: newId },
      { where: { userId: oldId }, transaction }
    );
    
    // 更新UserCommentLikes表中的userId
    await UserCommentLike.update(
      { userId: newId },
      { where: { userId: oldId }, transaction }
    );
    
    // 提交事务
    await transaction.commit();
    
    console.log('用户数据合并成功');
  } catch (error) {
    // 回滚事务
    await transaction.rollback();
    throw error;
  }
}

// 运行脚本
changeUserId();
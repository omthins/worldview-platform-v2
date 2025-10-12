const readline = require('readline');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 初始化数据库连接
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

// 定义用户模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
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

// 辅助函数：询问用户输入
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// 验证邮箱格式
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证ID格式（字母数字组合）
function isValidId(id) {
  const idRegex = /^[a-zA-Z0-9]+$/;
  return idRegex.test(id);
}

// 创建用户的主函数
async function createUser() {
  try {
    console.log('\n===== 创建新用户 =====\n');
    
    // 获取用户输入
    const userId = await askQuestion('请输入用户ID (支持字母和数字组合): ');
    while (!isValidId(userId)) {
      console.log('错误: ID只能包含字母和数字，不能为空');
      const newId = await askQuestion('请重新输入用户ID: ');
      if (!newId) break;
      if (isValidId(newId)) {
        userId = newId;
        break;
      }
    }
    
    const username = await askQuestion('请输入用户名: ');
    while (!username || username.trim() === '') {
      console.log('错误: 用户名不能为空');
      const newUsername = await askQuestion('请重新输入用户名: ');
      if (newUsername && newUsername.trim() !== '') {
        username = newUsername;
        break;
      }
    }
    
    const email = await askQuestion('请输入电子邮件: ');
    while (!isValidEmail(email)) {
      console.log('错误: 请输入有效的电子邮件地址');
      const newEmail = await askQuestion('请重新输入电子邮件: ');
      if (isValidEmail(newEmail)) {
        email = newEmail;
        break;
      }
    }
    
    const password = await askQuestion('请输入密码: ');
    while (!password || password.length < 6) {
      console.log('错误: 密码不能为空且长度至少为6位');
      const newPassword = await askQuestion('请重新输入密码: ');
      if (newPassword && newPassword.length >= 6) {
        password = newPassword;
        break;
      }
    }
    
    const avatar = await askQuestion('请输入头像URL (可选，直接回车跳过): ');
    const bio = await askQuestion('请输入个人简介 (可选，直接回车跳过): ');
    
    // 检查用户ID是否已存在
    const existingUserById = await User.findByPk(userId);
    if (existingUserById) {
      console.log(`\n错误: 用户ID "${userId}" 已存在`);
      return;
    }
    
    // 检查用户名是否已存在
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      console.log(`\n错误: 用户名 "${username}" 已存在`);
      return;
    }
    
    // 检查邮箱是否已存在
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      console.log(`\n错误: 电子邮件 "${email}" 已存在`);
      return;
    }
    
    // 创建用户
    const newUser = await User.create({
      id: userId,
      username: username,
      email: email,
      password: password,
      avatar: avatar || '',
      bio: bio || ''
    });
    
    console.log('\n===== 用户创建成功 =====');
    console.log(`ID: ${newUser.id}`);
    console.log(`用户名: ${newUser.username}`);
    console.log(`电子邮件: ${newUser.email}`);
    console.log(`头像: ${newUser.avatar || '未设置'}`);
    console.log(`个人简介: ${newUser.bio || '未设置'}`);
    console.log(`创建时间: ${newUser.createdAt}`);
    
  } catch (error) {
    console.error('创建用户失败:', error);
  }
}

// 显示当前所有用户
async function listUsers() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt']
    });
    
    if (users.length === 0) {
      console.log('数据库中没有用户');
    } else {
      console.log('\n===== 当前所有用户 =====');
      users.forEach(user => {
        console.log(`ID: ${user.id}, 用户名: ${user.username}, 邮箱: ${user.email}, 创建时间: ${user.createdAt}`);
      });
    }
    
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
}

// 更改用户ID
async function changeUserId() {
  try {
    console.log('\n===== 更改用户ID =====\n');
    
    // 获取当前用户ID
    const currentId = await askQuestion('请输入要更改的用户ID: ');
    if (!currentId || !isValidId(currentId)) {
      console.log('错误: 请输入有效的用户ID');
      return;
    }
    
    // 查找用户
    const user = await User.findByPk(currentId);
    if (!user) {
      console.log(`错误: 找不到ID为 "${currentId}" 的用户`);
      return;
    }
    
    console.log(`\n当前用户信息:`);
    console.log(`ID: ${user.id}`);
    console.log(`用户名: ${user.username}`);
    console.log(`电子邮件: ${user.email}`);
    
    // 获取新ID
    const newId = await askQuestion('\n请输入新的用户ID (支持字母和数字组合): ');
    if (!newId || !isValidId(newId)) {
      console.log('错误: 新ID只能包含字母和数字，不能为空');
      return;
    }
    
    // 检查新ID是否已存在
    const existingUser = await User.findByPk(newId);
    if (existingUser) {
      console.log(`错误: 用户ID "${newId}" 已存在`);
      return;
    }
    
    // 确认更改
    const confirm = await askQuestion(`\n确认将用户ID从 "${currentId}" 更改为 "${newId}" 吗? (y/n): `);
    if (confirm.toLowerCase() !== 'y') {
      console.log('操作已取消');
      return;
    }
    
    // 更新用户ID - 由于ID是主键，我们需要创建新用户并删除旧用户
    const userData = {
      id: newId,
      username: user.username,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: new Date()
    };
    
    // 创建新用户
    await User.create(userData);
    
    // 删除旧用户
    await User.destroy({
      where: { id: currentId }
    });
    
    console.log('\n===== 用户ID更改成功 =====');
    console.log(`原ID: ${currentId}`);
    console.log(`新ID: ${newId}`);
    
  } catch (error) {
    console.error('更改用户ID失败:', error);
  }
}

// 主菜单
async function mainMenu() {
  console.log('\n===== 用户管理系统 =====');
  console.log('1. 创建新用户');
  console.log('2. 查看所有用户');
  console.log('3. 更改用户ID');
  console.log('4. 退出');
  
  const choice = await askQuestion('\n请选择操作 (1-4): ');
  
  switch (choice) {
    case '1':
      await createUser();
      await mainMenu();
      break;
    case '2':
      await listUsers();
      await mainMenu();
      break;
    case '3':
      await changeUserId();
      await mainMenu();
      break;
    case '4':
      console.log('再见！');
      rl.close();
      await sequelize.close();
      return;
    default:
      console.log('无效选择，请重新输入');
      await mainMenu();
  }
}

// 启动程序
async function startApp() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 同步数据库
    await sequelize.sync({ alter: true });
    
    // 启动主菜单
    await mainMenu();
  } catch (error) {
    console.error('应用程序启动失败:', error);
    process.exit(1);
  }
}

startApp();
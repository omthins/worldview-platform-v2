/**
 * 账户查询测试脚本
 * 用于查询系统中的用户账户信息
 * 
 * 使用方法：
 * 1. 确保PostgreSQL数据库正在运行
 * 2. 在项目根目录运行：node test.js/账户查询测试.js
 * 3. 按照提示选择查询选项
 */

const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

// 加载环境变量
require('dotenv').config();

// 数据库连接配置
const sequelize = new Sequelize(
  process.env.DB_NAME || 'worldview_platform',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'mc114514',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

// 用户模型
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatar: {
    type: Sequelize.TEXT,
    defaultValue: ''
  },
  bio: {
    type: Sequelize.TEXT,
    defaultValue: ''
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'Users',
  timestamps: true
});

// 主函数
async function main() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 同步模型
    await User.sync();
    
    // 显示菜单
    console.log('\n===== 账户查询工具 =====');
    console.log('1. 查询所有用户账户');
    console.log('2. 根据用户名查询账户');
    console.log('3. 根据邮箱查询账户');
    console.log('4. 验证用户密码');
    console.log('5. 退出');
    
    // 获取用户输入
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('\n请选择操作 (1-5): ', async (choice) => {
      switch (choice) {
        case '1':
          await getAllUsers();
          break;
        case '2':
          rl.question('请输入用户名: ', async (username) => {
            await getUserByUsername(username);
            rl.close();
          });
          return;
        case '3':
          rl.question('请输入邮箱: ', async (email) => {
            await getUserByEmail(email);
            rl.close();
          });
          return;
        case '4':
          rl.question('请输入用户名: ', async (username) => {
            rl.question('请输入密码: ', async (password) => {
              await verifyPassword(username, password);
              rl.close();
            });
          });
          return;
        case '5':
          console.log('退出程序');
          break;
        default:
          console.log('无效选择');
      }
      
      rl.close();
    });
    
    // 监听关闭事件
    rl.on('close', async () => {
      await sequelize.close();
      console.log('数据库连接已关闭');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

// 获取所有用户
async function getAllUsers() {
  try {
    // 获取所有用户数据
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // 不显示密码
    });
    
    console.log('\n===== 所有用户账户 =====');
    if (users.length === 0) {
      console.log('没有找到任何用户账户');
    } else {
      console.log(`找到 ${users.length} 个用户账户:`);
      users.forEach((user, index) => {
        console.log(`\n用户 ${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  用户名: ${user.username}`);
        console.log(`  邮箱: ${user.email}`);
        console.log(`  头像: ${user.avatar ? '已设置' : '未设置'}`);
        console.log(`  简介: ${user.bio || '未设置'}`);
        console.log(`  注册时间: ${user.createdAt.toLocaleString()}`);
      });
    }
  } catch (error) {
    console.error('❌ 查询用户失败:', error.message);
  }
}

// 根据用户名查询用户
async function getUserByUsername(username) {
  try {
    const user = await User.findOne({
      where: { username },
      attributes: { exclude: ['updatedAt'] }
    });
    
    if (!user) {
      console.log(`📝 没有找到用户名为 "${username}" 的账户`);
      return;
    }
    
    console.log('\n📝 用户账户信息:');
    console.log('----------------------------------------');
    console.log(`用户名: ${user.username}`);
    console.log(`邮箱: ${user.email}`);
    console.log(`头像: ${user.avatar || '无'}`);
    console.log(`简介: ${user.bio || '无'}`);
    console.log(`注册时间: ${user.createdAt.toLocaleString()}`);
    console.log('----------------------------------------');
  } catch (error) {
    console.error('❌ 查询用户失败:', error.message);
  }
}

// 根据邮箱查询用户
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ['updatedAt'] }
    });
    
    if (!user) {
      console.log(`📝 没有找到邮箱为 "${email}" 的账户`);
      return;
    }
    
    console.log('\n📝 用户账户信息:');
    console.log('----------------------------------------');
    console.log(`用户名: ${user.username}`);
    console.log(`邮箱: ${user.email}`);
    console.log(`头像: ${user.avatar || '无'}`);
    console.log(`简介: ${user.bio || '无'}`);
    console.log(`注册时间: ${user.createdAt.toLocaleString()}`);
    console.log('----------------------------------------');
  } catch (error) {
    console.error('❌ 查询用户失败:', error.message);
  }
}

// 验证密码
async function verifyPassword(username, password) {
  try {
    const user = await User.findOne({
      where: { username }
    });
    
    if (!user) {
      console.log(`❌ 没有找到用户名为 "${username}" 的账户`);
      return;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      console.log('✅ 密码验证成功');
      console.log(`用户名: ${user.username}`);
      console.log(`邮箱: ${user.email}`);
    } else {
      console.log('❌ 密码验证失败');
    }
  } catch (error) {
    console.error('❌ 验证密码失败:', error.message);
  }
}

// 运行主函数
main();
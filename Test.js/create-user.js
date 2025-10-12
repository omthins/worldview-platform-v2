const { User } = require('../server/models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

async function createUser() {
  try {
    // 获取用户输入
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // 询问用户信息
    const username = await new Promise(resolve => {
      rl.question('请输入用户名: ', answer => resolve(answer));
    });

    const email = await new Promise(resolve => {
      rl.question('请输入邮箱: ', answer => resolve(answer));
    });

    const password = await new Promise(resolve => {
      rl.question('请输入密码: ', answer => resolve(answer));
    });

    const bio = await new Promise(resolve => {
      rl.question('请输入个人简介 (可选): ', answer => resolve(answer));
    });

    rl.close();

    // 检查用户是否已存在
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username: username },
          { email: email }
        ]
      } 
    });

    if (existingUser) {
      console.log('用户名或邮箱已存在！');
      return;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      bio: bio || ''
    });

    console.log(`用户 ${username} 创建成功！`);
    console.log(`用户ID: ${newUser.id}`);
    console.log(`邮箱: ${newUser.email}`);
    console.log(`创建时间: ${newUser.createdAt}`);

  } catch (error) {
    console.error('创建用户失败:', error);
  }
}

// 如果直接运行此脚本，则执行创建用户函数
if (require.main === module) {
  createUser();
}

module.exports = { createUser };
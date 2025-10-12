const { User, Worldview } = require('../server/models');
const { v4: uuidv4 } = require('uuid');

async function createWorldviewWithUser() {
  try {
    // 获取用户输入
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // 显示所有用户
    const users = await User.findAll({
      attributes: ['id', 'username', 'email']
    });
    
    if (users.length === 0) {
      console.log('系统中没有用户，请先创建用户！');
      rl.close();
      return;
    }
    
    console.log('\n现有用户列表:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, 用户名: ${user.username}, 邮箱: ${user.email}`);
    });
    
    // 选择用户
    const userChoice = await new Promise(resolve => {
      rl.question('\n请选择用户 (输入用户ID): ', answer => resolve(answer));
    });
    
    const selectedUser = await User.findByPk(userChoice);
    if (!selectedUser) {
      console.log('无效的用户ID！');
      rl.close();
      return;
    }
    
    console.log(`\n已选择用户: ${selectedUser.username}`);
    
    // 获取世界观信息
    const title = await new Promise(resolve => {
      rl.question('请输入世界观标题: ', answer => resolve(answer));
    });
    
    const description = await new Promise(resolve => {
      rl.question('请输入世界观描述: ', answer => resolve(answer));
    });
    
    const content = await new Promise(resolve => {
      rl.question('请输入世界观内容: ', answer => resolve(answer));
    });
    
    const category = await new Promise(resolve => {
      rl.question('请输入世界观分类 (可选): ', answer => resolve(answer));
    });
    
    const tagsInput = await new Promise(resolve => {
      rl.question('请输入标签 (用逗号分隔，可选): ', answer => resolve(answer));
    });
    
    const isPublicInput = await new Promise(resolve => {
      rl.question('是否公开 (y/n，默认为y): ', answer => resolve(answer.toLowerCase()));
    });
    
    const isPublic = isPublicInput === 'n' ? false : true;
    
    rl.close();
    
    // 获取最大的世界观编号，用于生成新的世界观编号
    const maxWorldviewNumber = await Worldview.max('worldviewNumber', {
      where: { authorId: selectedUser.id }
    });
    
    // 如果用户没有世界观，则从1开始；否则从最大编号+1开始
    const worldviewNumber = maxWorldviewNumber ? maxWorldviewNumber + 1 : 1;
    
    // 处理标签
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
    
    // 创建世界观
    const newWorldview = await Worldview.create({
      id: uuidv4(),
      title,
      description,
      content,
      category: category || '未分类',
      tags,
      views: 0,
      isPublic,
      authorId: selectedUser.id,
      worldviewNumber: worldviewNumber
    });
    
    console.log('\n世界观创建成功！');
    console.log(`ID: ${newWorldview.id}`);
    console.log(`标题: ${newWorldview.title}`);
    console.log(`作者: ${selectedUser.username}`);
    console.log(`世界观编号: ${newWorldview.worldviewNumber}`);
    console.log(`分类: ${newWorldview.category}`);
    console.log(`标签: ${newWorldview.tags.join(', ')}`);
    console.log(`是否公开: ${newWorldview.isPublic ? '是' : '否'}`);
    console.log(`创建时间: ${newWorldview.createdAt}`);
    
  } catch (error) {
    console.error('创建世界观失败:', error);
  }
}

// 如果直接运行此脚本，则执行创建世界观函数
if (require.main === module) {
  createWorldviewWithUser();
}

module.exports = { createWorldviewWithUser };
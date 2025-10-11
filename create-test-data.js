const sequelize = require('./server/config/database');
const { User, Worldview } = require('./server/models');
const bcrypt = require('bcryptjs');

async function createTestData() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 创建测试用户
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await User.findOrCreate({
      where: { email: 'test@example.com' },
      defaults: {
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        avatar: 'https://picsum.photos/seed/testuser/200/200.jpg'
      }
    });

    console.log('测试用户创建成功');

    // 创建测试世界观
    const testWorldviews = [
      {
        title: '魔法世界：艾泽拉斯',
        description: '一个充满魔法和冒险的奇幻世界，各种种族在这里共存。',
        content: '# 艾泽拉斯世界\n\n艾泽拉斯是一个充满魔法的世界，这里有精灵、人类、兽人等各种种族。\n\n## 历史\n\n艾泽拉斯的历史可以追溯到上古时代...',
        category: '奇幻',
        tags: ['魔法', '冒险', '多种族'],
        coverImage: 'https://picsum.photos/seed/world1/800/400.jpg',
        authorId: testUser[0].id,
        isPublic: true
      },
      {
        title: '星际帝国：银河纪元',
        description: '在遥远的未来，人类已经征服了银河系，建立了庞大的星际帝国。',
        content: '# 银河纪元\n\n在25世纪，人类已经掌握了超光速旅行技术，开始向银河系扩张。\n\n## 技术发展\n\n超光速引擎、能量护盾、激光武器...',
        category: '科幻',
        tags: ['太空', '未来', '科技'],
        coverImage: 'https://picsum.photos/seed/world2/800/400.jpg',
        authorId: testUser[0].id,
        isPublic: true
      },
      {
        title: '赛博朋克：新东京',
        description: '在2077年的新东京，科技与人性交织，企业控制着一切。',
        content: '# 新东京2077\n\n新东京是世界上最先进的城市，也是企业权力的象征。\n\n## 社会结构\n\n在这个世界里，企业比政府更有权力...',
        category: '科幻',
        tags: ['赛博朋克', '未来', '反乌托邦'],
        coverImage: 'https://picsum.photos/seed/world3/800/400.jpg',
        authorId: testUser[0].id,
        isPublic: true
      }
    ];

    for (const worldview of testWorldviews) {
      await Worldview.findOrCreate({
        where: { title: worldview.title },
        defaults: worldview
      });
    }

    console.log('测试世界观创建成功');

    // 关闭数据库连接
    await sequelize.close();
    console.log('测试数据创建完成');
  } catch (error) {
    console.error('创建测试数据失败:', error);
  }
}

createTestData();
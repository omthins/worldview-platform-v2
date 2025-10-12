/**
 * 创建系统用户和测试世界观脚本
 * 
 * 功能：
 * - 创建系统用户（如果不存在）
 * - 创建测试世界观（如果不存在）
 * - 自动分配世界观编号
 * 
 * 使用方法：
 * 1. 确保数据库连接正常
 * 2. 运行脚本：node create-system-worldview.js
 * 
 * 注意事项：
 * - 此脚本会创建系统用户和测试世界观
 * - 如果已存在，则不会重复创建
 * - 系统用户邮箱：system@worldview.com
 * - 系统用户密码：system123
 */

// 导入必要的模块
const sequelize = require('../server/config/database');
const { User, Worldview } = require('../server/models');
const bcrypt = require('bcryptjs');

// 系统用户配置
const SYSTEM_USER_CONFIG = {
  email: 'system@worldview.com',
  username: 'System',
  password: 'system123',
  avatar: 'https://picsum.photos/seed/system/200/200.jpg',
  bio: '系统自动生成的测试用户'
};

// 测试世界观配置
const TEST_WORLDVIEW_CONFIG = {
  title: '测试世界观：虚空领域',
  description: '这是一个用于测试的世界观，不属于任何真实用户。它描述了一个存在于虚空中的神秘领域。',
  content: '# 虚空领域\n\n虚空领域是一个存在于现实与虚幻之间的神秘空间。\n\n## 特性\n\n- 时间在这里没有意义\n- 物理法则可以被随意改写\n- 只有强大的意识才能进入这里\n\n## 居民\n\n虚空领域中居住着各种神秘的存在，它们不受物质世界的束缚。\n\n## 用途\n\n这个世界观仅用于测试目的，验证系统功能。',
  category: '测试',
  tags: ['测试', '虚空', '神秘'],
  coverImage: 'https://picsum.photos/seed/void/800/400.jpg',
  isPublic: true
};

/**
 * 主函数：创建系统用户和测试世界观
 */
async function createSystemWorldview() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 创建系统用户（如果不存在）
    const hashedPassword = await bcrypt.hash(SYSTEM_USER_CONFIG.password, 10);
    let systemUser;
    
    try {
      const [user, created] = await User.findOrCreate({
        where: { email: SYSTEM_USER_CONFIG.email },
        defaults: {
          username: SYSTEM_USER_CONFIG.username,
          email: SYSTEM_USER_CONFIG.email,
          password: hashedPassword,
          avatar: SYSTEM_USER_CONFIG.avatar,
          bio: SYSTEM_USER_CONFIG.bio
        }
      });
      
      systemUser = user;
      console.log('系统用户信息:', systemUser ? '已获取' : '未获取');
      
      if (created) {
        console.log('系统用户创建成功');
      } else {
        console.log('系统用户已存在');
      }
    } catch (error) {
      console.error('创建或查找系统用户失败:', error);
      await sequelize.close();
      return;
    }

    // 获取当前最大的世界观编号
    const maxWorldview = await Worldview.findOne({
      order: [['worldviewNumber', 'DESC']]
    });
    
    // 生成新的世界观编号
    const newWorldviewNumber = maxWorldview ? maxWorldview.worldviewNumber + 1 : 1;
    console.log('新的世界观编号:', newWorldviewNumber);

    // 创建测试世界观
    try {
      const [testWorldview, worldviewCreated] = await Worldview.findOrCreate({
        where: { title: TEST_WORLDVIEW_CONFIG.title },
        defaults: {
          worldviewNumber: newWorldviewNumber,
          title: TEST_WORLDVIEW_CONFIG.title,
          description: TEST_WORLDVIEW_CONFIG.description,
          content: TEST_WORLDVIEW_CONFIG.content,
          category: TEST_WORLDVIEW_CONFIG.category,
          tags: TEST_WORLDVIEW_CONFIG.tags,
          coverImage: TEST_WORLDVIEW_CONFIG.coverImage,
          authorId: systemUser.id,
          isPublic: TEST_WORLDVIEW_CONFIG.isPublic
        }
      });

      if (worldviewCreated) {
        console.log('测试世界观创建成功，编号:', newWorldviewNumber);
      } else {
        console.log('测试世界观已存在');
      }
    } catch (error) {
      console.error('创建测试世界观失败:', error);
      console.error('系统用户ID:', systemUser ? systemUser.id : '未定义');
    }

    // 关闭数据库连接
    await sequelize.close();
    console.log('操作完成');
  } catch (error) {
    console.error('创建测试世界观失败:', error);
  }
}

// 执行主函数
createSystemWorldview();
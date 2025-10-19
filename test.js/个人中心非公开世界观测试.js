// 测试个人中心非公开世界观查看功能
// 修复问题：个人中心和个人档案中，非公开世界观自己也看不到

const axios = require('axios');

// 配置
const BASE_URL = 'http://localhost:5000';
const CLIENT_URL = 'http://localhost:3000';

async function testPrivateWorldviewAccess() {
  console.log('开始测试个人中心非公开世界观查看功能...\n');
  
  try {
    // 1. 测试获取当前用户的世界观（应该包括非公开的）
    console.log('1. 测试获取当前用户的世界观...');
    
    // 模拟登录用户获取token
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'testuser',
      password: 'password123'
    });
    
    if (loginResponse.data.token) {
      const token = loginResponse.data.token;
      console.log('✓ 登录成功，获取到token');
      
      // 使用认证token获取当前用户的世界观
      const userWorldviewsResponse = await axios.get(`${BASE_URL}/api/worldviews/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const worldviews = userWorldviewsResponse.data.worldviews;
      console.log(`✓ 获取到 ${worldviews.length} 个世界观`);
      
      // 检查是否包含非公开世界观
      const hasPrivateWorldview = worldviews.some(wv => !wv.isPublic);
      if (hasPrivateWorldview) {
        console.log('✓ 成功获取到非公开世界观');
      } else {
        console.log('⚠ 未找到非公开世界观（可能用户没有创建非公开世界观）');
      }
      
      // 显示世界观列表
      console.log('\n世界观列表:');
      worldviews.forEach((wv, index) => {
        console.log(`${index + 1}. ${wv.title} (${wv.isPublic ? '公开' : '非公开'})`);
      });
    } else {
      console.log('✗ 登录失败，无法获取token');
    }
    
    // 2. 测试获取指定用户的世界观（应该只包括公开的）
    console.log('\n2. 测试获取指定用户的世界观...');
    
    // 获取测试用户ID（假设为1）
    const userId = 1;
    const publicWorldviewsResponse = await axios.get(`${BASE_URL}/api/worldviews/user/${userId}`);
    
    const publicWorldviews = publicWorldviewsResponse.data.worldviews;
    console.log(`✓ 获取到用户 ${userId} 的 ${publicWorldviews.length} 个公开世界观`);
    
    // 检查是否只包含公开世界观
    const hasOnlyPublicWorldviews = publicWorldviews.every(wv => wv.isPublic);
    if (hasOnlyPublicWorldviews) {
      console.log('✓ 只返回公开世界观，符合预期');
    } else {
      console.log('✗ 返回了非公开世界观，不符合预期');
    }
    
    console.log('\n测试完成！');
    console.log('\n修复总结:');
    console.log('1. 修改了Profile.js中的API调用，从/api/worldviews/user/${user.id}改为/api/worldviews/user');
    console.log('2. 调整了后端路由定义顺序，确保/api/worldviews/user/:userId在/api/worldviews/user之前');
    console.log('3. 现在个人中心可以查看所有世界观（包括非公开的），而其他用户查看个人档案只能看到公开世界观');
    
  } catch (error) {
    console.error('测试过程中出错:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

// 运行测试
testPrivateWorldviewAccess();
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// 服务器配置
const SERVER_URL = 'http://localhost:5000';

// 测试用户登录信息（请替换为实际的用户信息）
const LOGIN_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

// 图片文件路径（请替换为实际存在的图片路径）
const IMAGE_PATH = path.join(__dirname, 'test-image.jpg');

// 如果测试图片不存在，创建一个简单的测试图片
if (!fs.existsSync(IMAGE_PATH)) {
  console.log('创建测试图片...');
  // 这里应该创建一个真实的测试图片，但为了简化，我们假设图片已存在
  console.log('请确保在当前目录下有一个名为 test-image.jpg 的图片文件');
  process.exit(1);
}

async function testImageUpload() {
  try {
    console.log('开始测试图片上传...');
    
    // 1. 登录获取token
    console.log('1. 登录获取token...');
    const loginResponse = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(LOGIN_CREDENTIALS)
    });
    
    if (!loginResponse.ok) {
      throw new Error(`登录失败: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('登录成功，获取到token');
    
    // 2. 上传图片
    console.log('2. 上传图片...');
    const form = new FormData();
    form.append('image', fs.createReadStream(IMAGE_PATH));
    
    const uploadResponse = await fetch(`${SERVER_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      },
      body: form
    });
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      throw new Error(`图片上传失败: ${uploadResponse.status} - ${errorData}`);
    }
    
    const uploadData = await uploadResponse.json();
    console.log('图片上传成功!');
    console.log('图片URL:', uploadData.imageUrl);
    console.log('完整图片URL:', `${SERVER_URL}${uploadData.imageUrl}`);
    
    // 3. 测试图片访问
    console.log('3. 测试图片访问...');
    const imageResponse = await fetch(`${SERVER_URL}${uploadData.imageUrl}`);
    
    if (!imageResponse.ok) {
      throw new Error(`图片访问失败: ${imageResponse.status}`);
    }
    
    console.log('图片访问成功!');
    console.log('图片大小:', imageResponse.headers.get('content-length'), 'bytes');
    
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 执行测试
testImageUpload();
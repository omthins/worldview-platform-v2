const http = require('http');

async function testRegister() {
  try {
    const userData = {
      username: `test${Math.floor(Math.random() * 10000)}`,
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    console.log('发送注册请求:', userData);
    
    const postData = JSON.stringify(userData);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      console.log(`状态码: ${res.statusCode}`);
      console.log(`响应头: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('响应体:', data);
        try {
          const jsonData = JSON.parse(data);
          console.log('解析后的响应:', jsonData);
        } catch (e) {
          console.error('解析JSON失败:', e.message);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`请求遇到问题: ${e.message}`);
    });
    
    // 写入数据到请求主体
    req.write(postData);
    req.end();
  } catch (error) {
    console.error('注册失败:', error.message);
  }
}

testRegister();
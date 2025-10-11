const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./models');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const worldviewRoutes = require('./routes/worldviews');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/upload');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

// 连接数据库
connectDB();

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/worldviews', worldviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);

// 默认路由
app.get('/', (req, res) => {
  res.send('世界观发布平台 API 运行中');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
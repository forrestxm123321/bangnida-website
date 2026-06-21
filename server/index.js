// ==========================================
// Bangnida Server - Main Entry
// 部署到阿里云香港服务器
// ==========================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件 - 前端网站
app.use(express.static(path.join(__dirname, '..', 'website')));

// 上传文件访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/homepage', require('./routes/homepage'));
app.use('/api/services', require('./routes/services'));
app.use('/api/products', require('./routes/products'));
app.use('/api/industries', require('./routes/industries'));
app.use('/api/about', require('./routes/about'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/inquiry', require('./routes/inquiry'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 启动服务器
app.listen(config.port, () => {
  console.log(`Bangnida Server running on port ${config.port}`);
  console.log(`Site: http://localhost:${config.port}`);
  console.log(`Admin: http://localhost:${config.port}/admin/`);
});

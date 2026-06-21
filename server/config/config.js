// ==========================================
// Bangnida Server Configuration
// 部署到阿里云时修改以下配置
// ==========================================

module.exports = {
  // 服务器端口
  port: process.env.PORT || 3000,

  // MySQL 数据库配置
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'bangnida',
    password: process.env.DB_PASSWORD || 'Bangnida2026!',
    database: process.env.DB_NAME || 'bangnida_db'
  },

  // JWT 密钥（用于后台登录认证）
  jwtSecret: process.env.JWT_SECRET || 'bangnida_jwt_secret_key_2026',

  // 图片上传路径
  uploadDir: process.env.UPLOAD_DIR || 'uploads',

  // 网站域名
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',

  // 管理员默认账号（首次启动后请修改密码）
  admin: {
    username: 'admin',
    password: 'bangnida2026'
  }
};

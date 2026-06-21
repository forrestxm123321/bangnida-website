# Bangnida CNC Machining Website - Server Backend
# Node.js + Express + MySQL
# 部署到阿里云香港轻量服务器

## 目录结构
```
server/
├── package.json          # 依赖配置
├── index.js              # 主入口
├── db.js                 # 数据库连接
├── schema.sql            # SQL建表语句
├── config/
│   └── config.js         # 配置文件
├── routes/
│   ├── auth.js           # 管理员登录
│   ├── upload.js         # 图片上传
│   ├── homepage.js       # 首页数据
│   ├── services.js       # 服务管理
│   ├── products.js       # 产品案例
│   ├── industries.js     # 行业管理
│   ├── about.js          # 关于我们
│   └── contact.js        # 联系信息
└── uploads/              # 上传图片存储
```

## 阿里云部署步骤

1. 购买阿里云香港轻量服务器
2. 安装 Node.js + MySQL
3. 导入 schema.sql 创建数据库
4. 修改 config.js 中的数据库密码
5. 运行 `npm install && npm start`
6. 配置 Nginx 反向代理 + SSL 证书
7. 域名解析到服务器 IP

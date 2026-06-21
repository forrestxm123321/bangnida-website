# 部署到阿里云香港轻量服务器

## 1. 购买服务器
- 阿里云 → 轻量应用服务器 → 香港节点
- 配置：2核2G，60G SSD（¥68/月）
- 操作系统：Ubuntu 22.04 或 CentOS 7+

## 2. 连接服务器
```bash
ssh root@你的服务器IP
```

## 3. 安装 Node.js + MySQL
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 安装 MySQL
apt-get install -y mysql-server
mysql_secure_installation

# 创建数据库
mysql -u root -p < /var/www/bangnida/server/schema.sql
```

## 4. 上传网站文件
```bash
# 在本地打包
cd d:/my-projects/bangnida
# 上传到服务器 /var/www/bangnida/
```

## 5. 配置后端
```bash
cd /var/www/bangnida/server
npm install

# 修改数据库配置
vi config/config.js
# 修改 DB_PASSWORD 为你的 MySQL 密码

# 初始化管理员密码（运行一次后删除）
node -e "
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
async function init() {
  const conn = await mysql.createConnection({host:'localhost',user:'root',password:'你的密码',database:'bangnida_db'});
  const hash = await bcrypt.hash('bangnida2026', 10);
  await conn.query('UPDATE admin_users SET password=? WHERE username=?', [hash, 'admin']);
  console.log('Admin password updated');
  await conn.end();
}
init();
"

# 启动服务
npm install -y pm2
pm2 start index.js --name bangnida
pm2 save
pm2 startup
```

## 6. 配置 Nginx + SSL
```bash
apt-get install -y nginx

# 配置 Nginx 反向代理
cat > /etc/nginx/sites-available/bangnida << 'EOF'
server {
    listen 80;
    server_name bangnida.com www.bangnida.com;

    # 申请免费 SSL 后改为 443
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 大文件上传支持
    client_max_body_size 50m;
}
EOF

ln -s /etc/nginx/sites-available/bangnida /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# 申请免费 SSL 证书（阿里云控制台申请）
# 或使用 certbot：
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d bangnida.com -d www.bangnida.com
```

## 7. 域名解析
在阿里云 DNS 控制台：
- bangnida.com → 你的服务器 IP
- www.bangnida.com → 你的服务器 IP

## 后台访问
https://bangnida.com/admin/
账号：admin
密码：bangnida2026（登录后请修改）

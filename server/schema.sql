-- ==========================================
-- Bangnida CNC Machining Website Database
-- MySQL 建表脚本
-- 在阿里云 MySQL 中执行此文件
-- ==========================================

CREATE DATABASE IF NOT EXISTS bangnida_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bangnida_db;

-- ----------------------------
-- 管理员表
-- ----------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 首页设置
-- ----------------------------
CREATE TABLE IF NOT EXISTS homepage_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hero_title VARCHAR(255) DEFAULT '',
  hero_subtitle TEXT,
  badges JSON,
  stats JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 图片管理
-- ----------------------------
CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_key VARCHAR(50) NOT NULL UNIQUE COMMENT 'logo/banner1/banner2/banner3',
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 服务管理
-- ----------------------------
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sort_order INT DEFAULT 0,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  features JSON,
  image VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 产品案例
-- ----------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sort_order INT DEFAULT 0,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT '',
  description TEXT,
  features JSON,
  specs JSON COMMENT 'Material/Tolerance/Finish/Process/LeadTime/Qty等',
  image VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 行业管理
-- ----------------------------
CREATE TABLE IF NOT EXISTS industries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sort_order INT DEFAULT 0,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 关于我们
-- ----------------------------
CREATE TABLE IF NOT EXISTS about_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description TEXT,
  mission TEXT,
  facility JSON COMMENT '设备统计表格数据',
  quality JSON COMMENT '质量承诺列表',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 联系信息
-- ----------------------------
CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) DEFAULT '',
  address VARCHAR(500) DEFAULT '',
  phone VARCHAR(100) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  working_hours VARCHAR(255) DEFAULT '',
  social JSON COMMENT 'Facebook/TikTok/Instagram/LinkedIn链接',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 联络/报价表单提交记录
-- ----------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('contact','quote') NOT NULL COMMENT 'contact=联络表单, quote=报价表单',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  company VARCHAR(255) DEFAULT '',
  subject VARCHAR(255) DEFAULT '',
  message TEXT,
  status ENUM('new','read','replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- 插入默认数据
-- ----------------------------
INSERT INTO admin_users (username, password) VALUES
('admin', '$2a$10$dummy_hash_placeholder_change_me');

INSERT INTO homepage_settings (hero_title, hero_subtitle, badges, stats) VALUES
(
  'Precision CNC Machining Services for Global Industries',
  'From rapid prototyping to high-volume production — we deliver tight-tolerance CNC machined parts with ISO-certified quality.',
  '[{"text":"ISO 9001 Certified","icon":"certificate"},{"text":"Precision Tolerances ±0.005mm","icon":"ruler"},{"text":"Fast Turnaround 3-15 Days","icon":"truck"}]',
  '[{"label":"Years Experience","value":"15+"},{"label":"CNC Machines","value":"200+"},{"label":"Projects Delivered","value":"5000+"},{"label":"On-Time Delivery","value":"98%"}]'
);

INSERT INTO images (image_key, file_name, file_path) VALUES
('logo', 'logo.svg', '/uploads/logo.svg'),
('banner1', 'banner-precision.svg', '/uploads/banner-precision.svg'),
('banner2', 'banner-facility.svg', '/uploads/banner-facility.svg'),
('banner3', 'banner-quality.svg', '/uploads/banner-quality.svg');

INSERT INTO about_content (description, mission, facility, quality) VALUES
(
  'Bangnida (Zhangzhou) Intelligent Technology Co., Ltd. is a leading manufacturer of precision CNC machined components, headquartered in Zhangzhou, Fujian Province, China. With over 15 years of manufacturing expertise, we serve clients across aerospace, automotive, medical, industrial equipment, and consumer electronics industries.',
  'To provide global clients with high-quality CNC machined parts at competitive prices with reliable delivery.',
  '[{"label":"Facility Size","value":"8,000+ m²"},{"label":"CNC Machines","value":"200+ units"},{"label":"QC Staff","value":"25+ full-time"},{"label":"Engineers","value":"30+ experienced"},{"label":"CMM Machines","value":"6 units"},{"label":"Annual Capacity","value":"5+ million parts"}]',
  '["100% first-article inspection","In-process inspection at every stage","Final inspection with full reports","CMM inspection for critical features","Material certifications traceable to source","Continuous improvement through root cause analysis"]'
);

INSERT INTO contact_info (company_name, address, phone, email, working_hours, social) VALUES
(
  'Bangnida (Zhangzhou) Intelligent Technology Co., Ltd.',
  'Zhangzhou, Fujian, China',
  '+86-596-xxxxxxx',
  'info@bangnida.com',
  'Monday-Friday 8:00-18:00, Saturday 8:00-12:00 (CST)',
  '{"facebook":"https://facebook.com/bangnidacnc","tiktok":"https://tiktok.com/@bangnidacnc","instagram":"https://instagram.com/bangnidacnc","linkedin":"https://linkedin.com/company/bangnidacnc"}'
);

-- 插入默认服务
INSERT INTO services (sort_order, title, description, features, image) VALUES
(1, 'CNC Milling', '3-axis, 4-axis, and 5-axis CNC milling with tight tolerances down to ±0.005mm.', '["3/4/5-axis machining centers","Tolerances ±0.005mm","Parts up to 2000×1000×800mm","Aluminum, steel, titanium, plastics"]', '/uploads/cnc-milling.svg'),
(2, 'CNC Turning', 'High-precision CNC turning and Swiss machining for cylindrical components.', '["Single & multi-spindle turning","Swiss-type automatic lathes","OD/ID grinding & threading","Bar capacity up to Ø80mm"]', '/uploads/cnc-turning.svg'),
(3, '5-Axis Machining', 'Advanced 5-axis simultaneous machining for complex parts with demanding surface finishes.', '["Full 5-axis simultaneous","3+2 positioning","Reduced setups & lead time","Superior surface finish"]', '/uploads/5-axis.svg'),
(4, 'Swiss Machining', 'Ultra-precision small parts machining with Swiss-type automatic lathes.', '["Bar diameter 1-38mm","Live tooling","±0.005mm precision","Medical & aerospace grade"]', '/uploads/swiss.svg'),
(5, 'Surface Finishing', 'Enhance appearance, durability, and performance with various finishing options.', '["Anodizing Type II & III","Powder coating","Electroless nickel plating","Bead blasting & polishing"]', '/uploads/finishing.svg');

-- 插入默认产品
INSERT INTO products (sort_order, name, category, description, features, specs) VALUES
(1, 'Aircraft Engine Mounting Bracket', 'Aerospace', 'Complex 5-axis machined bracket from 7075-T6 aluminum with tight tolerance bores.', '["5-axis simultaneous","7075-T6 aluminum","Hard anodized Type III","CMM 100% inspection"]', '{"material":"7075-T6 Alu","tolerance":"±0.01mm","finish":"Hard Anodized","process":"5-Axis Mill"}'),
(2, 'Titanium Orthopedic Implant', 'Medical', 'Swiss-machined Ti-6Al-4V ELI implant with mirror surface finish.', '["Swiss CNC turning","Ti-6Al-4V ELI","0.4μm Ra mirror finish","ISO 13485 certified"]', '{"material":"Ti-6Al-4V ELI","tolerance":"±0.005mm","finish":"0.4μm Ra","process":"Swiss Turning"}');

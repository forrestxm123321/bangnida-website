const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('./auth');

// 获取首页数据
router.get('/', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM homepage_settings ORDER BY id DESC LIMIT 1');
    const [images] = await pool.query('SELECT * FROM images');
    const [services] = await pool.query('SELECT id, title, description FROM services ORDER BY sort_order');
    const [industries] = await pool.query('SELECT id, title FROM industries ORDER BY sort_order');
    const [products] = await pool.query('SELECT id, name, category FROM products ORDER BY sort_order');

    res.json({
      hero: settings[0] ? {
        title: settings[0].hero_title,
        subtitle: settings[0].hero_subtitle,
        badges: JSON.parse(settings[0].badges || '[]'),
        stats: JSON.parse(settings[0].stats || '[]')
      } : { title: '', subtitle: '', badges: [], stats: [] },
      images: images.reduce((acc, img) => {
        acc[img.image_key] = { name: img.file_name, url: img.file_path };
        return acc;
      }, {}),
      services: services.map(s => ({ id: s.id, title: s.title })),
      industries: industries.map(i => ({ id: i.id, title: i.title })),
      products: products.map(p => ({ id: p.id, name: p.name, category: p.category }))
    });
  } catch (err) {
    res.status(500).json({ error: '获取失败' });
  }
});

// 更新首页设置
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { hero_title, hero_subtitle, badges, stats } = req.body;
    const [existing] = await pool.query('SELECT id FROM homepage_settings ORDER BY id DESC LIMIT 1');
    if (existing.length > 0) {
      await pool.query(
        'UPDATE homepage_settings SET hero_title=?, hero_subtitle=?, badges=?, stats=? WHERE id=?',
        [hero_title, hero_subtitle, JSON.stringify(badges), JSON.stringify(stats), existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO homepage_settings (hero_title, hero_subtitle, badges, stats) VALUES (?,?,?,?)',
        [hero_title, hero_subtitle, JSON.stringify(badges), JSON.stringify(stats)]
      );
    }
    res.json({ message: '保存成功' });
  } catch (err) {
    res.status(500).json({ error: '保存失败' });
  }
});

module.exports = router;

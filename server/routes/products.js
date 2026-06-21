const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('./auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY sort_order');
    res.json(rows.map(r => ({ ...r, features: JSON.parse(r.features || '[]'), specs: JSON.parse(r.specs || '{}') })));
  } catch (err) { res.status(500).json({ error: '获取失败' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '未找到' });
    const r = rows[0];
    r.features = JSON.parse(r.features || '[]');
    r.specs = JSON.parse(r.specs || '{}');
    res.json(r);
  } catch (err) { res.status(500).json({ error: '获取失败' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category, description, features, specs, image } = req.body;
    const [result] = await pool.query('INSERT INTO products (name, category, description, features, specs, image) VALUES (?,?,?,?,?,?)',
      [name, category || '', description || '', JSON.stringify(features || []), JSON.stringify(specs || {}), image || '']);
    res.json({ id: result.insertId, message: '添加成功' });
  } catch (err) { res.status(500).json({ error: '添加失败' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, category, description, features, specs, image } = req.body;
    await pool.query('UPDATE products SET name=?, category=?, description=?, features=?, specs=?, image=? WHERE id=?',
      [name, category || '', description || '', JSON.stringify(features || []), JSON.stringify(specs || {}), image || '', req.params.id]);
    res.json({ message: '更新成功' });
  } catch (err) { res.status(500).json({ error: '更新失败' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try { await pool.query('DELETE FROM products WHERE id=?', [req.params.id]); res.json({ message: '删除成功' }); }
  catch (err) { res.status(500).json({ error: '删除失败' }); }
});

module.exports = router;

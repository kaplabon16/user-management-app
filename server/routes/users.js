const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT id, name, email, status, last_login FROM users ORDER BY last_login DESC`
    );
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});


router.post('/block', auth, async (req, res) => {
  const { ids } = req.body;
  try {
    await pool.query(`UPDATE users SET status = 'blocked' WHERE id = ANY($1::int[])`, [ids]);
    res.json({ message: 'Users blocked' });
  } catch (err) {
    res.status(500).json({ message: 'Error blocking users' });
  }
});


router.post('/unblock', auth, async (req, res) => {
  const { ids } = req.body;
  try {
    await pool.query(`UPDATE users SET status = 'active' WHERE id = ANY($1::int[])`, [ids]);
    res.json({ message: 'Users unblocked' });
  } catch (err) {
    res.status(500).json({ message: 'Error unblocking users' });
  }
});


router.post('/delete', auth, async (req, res) => {
  const { ids } = req.body;
  try {
    await pool.query(`DELETE FROM users WHERE id = ANY($1::int[])`, [ids]);
    res.json({ message: 'Users deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting users' });
  }
});

module.exports = router;

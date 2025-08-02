const jwt = require('jsonwebtoken');
const pool = require('../db');

module.exports = async function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, access denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (user.rows.length === 0 || user.rows[0].status === 'blocked') {
      return res.status(403).json({ message: 'User blocked or deleted.' });
    }

    req.user = user.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

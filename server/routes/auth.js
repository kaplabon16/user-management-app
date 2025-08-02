const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Register request:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, status) VALUES ($1, $2, $3, 'active')`,
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email already exists.' });
    }
    return res.status(500).json({ message: 'Server error.' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", req.body); 

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const userRes = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(403).json({ message: 'User does not exist.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'User is blocked.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await pool.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [user.id]);

    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;

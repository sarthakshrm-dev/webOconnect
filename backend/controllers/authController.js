const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dbConfig = require('../config/dbConfig');

exports.signup = async (req, res) => {
  try {
    const pool = mysql.createPool(dbConfig);
    const { name, email, gender, phone, password, status, date } = req.body;

    if (typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const checkEmailQuery = 'SELECT * FROM userstable WHERE email = ?';
    pool.query(checkEmailQuery, [email], async (error, results) => {
      if (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM userstable';

      pool.query(getMaxIdQuery, async (error, results) => {
        if (error) {
          console.error('Error retrieving max ID:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }

        const maxId = results[0].maxId;
        const newId = maxId === null ? 1 : maxId + 1;

        const newUser = new User({
          id: newId,
          name,
          email,
          gender,
          phone,
          password: hashedPassword,
          status,
          date,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { algorithm: 'HS256' });

    const { status } = user;

    res.status(200).json({ token, status });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


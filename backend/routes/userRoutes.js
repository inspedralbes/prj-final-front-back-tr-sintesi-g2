const express = require('express');
const User = require('../models/User');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const startUserService = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Get all users
  app.get('/users', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user by ID
  app.get('/users/:id', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create user
  app.post('/users', async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  const authRouter = express.Router();

  // Register new user
  authRouter.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'user',
        status: 'active'
      });

      // Create JWT token
      const token = jwt.sign(
        { id: user.id_user, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id_user,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Login user
  authRouter.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({ message: 'Account is inactive' });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id_user, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Update last login
      await user.update({ last_login: new Date() });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id_user,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.use('/auth', authRouter);

  const port = process.env.USER_PORT || 3004;
  app.listen(port, () => {
    console.log(`User service running on port ${port}`);
  });
};

module.exports = { startUserService };
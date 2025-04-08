const express = require('express');
const User = require('../models/User');

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

  const port = process.env.USER_SERVICE_PORT || 3001;
  app.listen(port, () => {
    console.log(`User service running on port ${port}`);
  });
};

module.exports = { startUserService };
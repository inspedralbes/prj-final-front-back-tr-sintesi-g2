const express = require('express');
const Enemy = require('../models/Enemy');
const cors = require('cors');

const startEnemyService = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Get all enemies
  app.get('/enemies', async (req, res) => {
    try {
      const enemies = await Enemy.findAll();
      res.json(enemies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get enemy by ID
  app.get('/enemies/:id', async (req, res) => {
    try {
      const enemy = await Enemy.findByPk(req.params.id);
      if (enemy) {
        res.json(enemy);
      } else {
        res.status(404).json({ message: 'Enemy not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const port = process.env.ENEMY_PORT || 3007;
  app.listen(port, () => {
    console.log(`Enemy service running on port ${port}`);
  });
};

module.exports = { startEnemyService };
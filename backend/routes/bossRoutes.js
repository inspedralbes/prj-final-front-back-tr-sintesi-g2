const express = require('express');
const Boss = require('../models/Boss');
const cors = require('cors');

const startBossService = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Get all bosses
  app.get('/bosses', async (req, res) => {
    try {
      const bosses = await Boss.findAll();
      res.json(bosses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get boss by ID
  app.get('/bosses/:id', async (req, res) => {
    try {
      const boss = await Boss.findByPk(req.params.id);
      if (boss) {
        res.json(boss);
      } else {
        res.status(404).json({ message: 'Boss not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update boss statistics
  app.put('/bosses/:id', async (req, res) => {
    try {
      const boss = await Boss.findByPk(req.params.id);
      if (boss) {
        await boss.update(req.body);
        res.json(boss);
      } else {
        res.status(404).json({ message: 'Boss not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const port = process.env.BOSS_PORT;
  app.listen(port, () => {
    console.log(`Boss service running on port ${port}`);
  });
};

module.exports = { startBossService };
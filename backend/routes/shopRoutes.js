const express = require('express');
const Shop = require('../models/Shop');
const cors = require('cors');
const path = require('path');

const startShopService = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Servir imágenes estáticas
  app.use('/imagenes', express.static(path.join(__dirname, '../imagenes'), {
    setHeaders: (res, path) => {
      res.set('Access-Control-Allow-Origin', '*');
    }
  }));

  // Obtener todas las skins
  app.get('/shop', async (req, res) => {
    try {
      const skins = await Shop.findAll();
      res.json(skins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener una skin por ID
  app.get('/shop/:id', async (req, res) => {
    try {
      const skin = await Shop.findByPk(req.params.id);
      if (skin) {
        res.json(skin);
      } else {
        res.status(404).json({ message: 'Skin no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear una nueva skin
  app.post('/shop', async (req, res) => {
    try {
      const newSkin = await Shop.create(req.body);
      res.status(201).json(newSkin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar una skin
  app.put('/shop/:id', async (req, res) => {
    try {
      const skin = await Shop.findByPk(req.params.id);
      if (skin) {
        await skin.update(req.body);
        res.json(skin);
      } else {
        res.status(404).json({ message: 'Skin no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar una skin
  app.delete('/shop/:id', async (req, res) => {
    try {
      const skin = await Shop.findByPk(req.params.id);
      if (skin) {
        await skin.destroy();
        res.json({ message: 'Skin eliminada' });
      } else {
        res.status(404).json({ message: 'Skin no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const port = process.env.SHOP_PORT || 3009;
  app.listen(port, () => {
    console.log(`Shop service running on port ${port}`);
  });
};

module.exports = { startShopService };

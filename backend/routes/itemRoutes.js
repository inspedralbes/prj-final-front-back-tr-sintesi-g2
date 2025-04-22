const express = require('express');
const Item = require('../models/Item');
const cors = require('cors');
const path = require('path');

const startItemService = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use('/imagenes', express.static(path.join(__dirname, '../imagenes'), {
    setHeaders: (res, path) => {
      res.set('Access-Control-Allow-Origin', '*');
    }
  }));
  

  // Obtener todos los ítems
  app.get('/items', async (req, res) => {
    try {
      const items = await Item.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener ítem por ID
  app.get('/items/:id', async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: 'Item no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar ítem
  app.put('/items/:id', async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id);
      if (item) {
        await item.update(req.body);
        res.json(item);
      } else {
        res.status(404).json({ message: 'Item no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar ítem
  app.delete('/items/:id', async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id);
      if (item) {
        await item.destroy();
        res.json({ message: 'Item eliminado' });
      } else {
        res.status(404).json({ message: 'Item no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const port = process.env.ITEM_PORT;
  app.listen(port, () => {
    console.log(`Item service running on port ${port}`);
  });
};

module.exports = { startItemService };

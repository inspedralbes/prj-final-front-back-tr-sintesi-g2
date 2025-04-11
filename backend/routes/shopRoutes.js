const express = require('express');
const Shop = require('../models/Shop');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../imagenes/shop')); // <-- Ajustado aquí
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

const startShopService = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use('/imagenes', express.static(path.join(__dirname, '../imagenes')));


  // Get all skins
  app.get('/shop', async (req, res) => {
    try {
      const skins = await Shop.findAll();
      res.json(skins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get skin by ID
  app.get('/shop/:id', async (req, res) => {
    try {
      const skin = await Shop.findByPk(req.params.id);
      if (skin) {
        res.json(skin);
      } else {
        res.status(404).json({ message: 'Skin not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new skin
  app.post('/shop', upload.single('image'), async (req, res) => {
    try {
      const { skin_name, description, price, rarity } = req.body;
      const image_url = req.file ? `/imagenes/shop/${req.file.filename}` : null;

      if (!skin_name || !price || !image_url) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const skin = await Shop.create({
        skin_name,
        description,
        price,
        image_url,
        rarity
      });

      res.status(201).json(skin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update skin
  app.put('/shop/:id', upload.single('image'), async (req, res) => {
    try {
      const skin = await Shop.findByPk(req.params.id);
      if (!skin) {
        return res.status(404).json({ message: 'Skin not found' });
      }

      const updateData = { ...req.body };
      if (req.file) {
        updateData.image_url = `/uploads/skins/${req.file.filename}`;
      }

      await skin.update(updateData);
      res.json(skin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete skin
  app.delete('/shop/:id', async (req, res) => {
    try {
      const skin = await Shop.findByPk(req.params.id);
      if (!skin) {
        return res.status(404).json({ message: 'Skin not found' });
      }

      await skin.destroy();
      res.json({ message: 'Skin deleted successfully' });
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

const express = require('express');
const multer = require('multer');
const Shop = require('../models/Shop');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const sharp = require('sharp');

const startShopService = () => {
  // Asegura que la carpeta tmp existe antes de usarla con Multer
  const tmpDir = path.join(__dirname, '../imagenes/shop/tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  // Multer config para subida de imágenes temporales
  const upload = multer({ dest: path.join(__dirname, '../imagenes/shop/tmp'), limits: { files: 8 } });
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Servir imágenes estáticas
  app.use('/imagenes', express.static(path.join(__dirname, '../imagenes'), {
    setHeaders: (res, path) => {
      res.set('Access-Control-Allow-Origin', '*');
    }
  }));

  // Subida múltiple de imágenes para la tienda (7 skins + 1 portada)
  app.post('/shop/upload-images', upload.array('images', 8), async (req, res) => {
    try {
      const { targetFolder } = req.body;
      if (!targetFolder) {
        return res.status(400).json({ error: 'Falta el parámetro targetFolder' });
      }
      if (!req.files || req.files.length !== 8) {
        return res.status(400).json({ error: 'Debes subir exactamente 8 imágenes (7 skins + 1 portada)' });
      }
      // Guardar las 7 imágenes de la skin
      const folderPath = path.join(__dirname, '../imagenes/shop', targetFolder);
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
      const suffixes = ['Attack', 'Dash', 'Death', 'Fall', 'Idle', 'Run', 'TakeHit'];
      req.files.slice(0, 7).forEach((file, idx) => {
        const newName = `${targetFolder}${suffixes[idx]}.png`;
        const destPath = path.join(folderPath, newName);
        fs.renameSync(file.path, destPath);
      });
      // Guardar la portada como JPG
      const portadaDir = path.join(__dirname, '../imagenes/shop/Portadas');
      if (!fs.existsSync(portadaDir)) fs.mkdirSync(portadaDir, { recursive: true });
      const portadaFile = req.files[7];
      const portadaDestJpg = path.join(portadaDir, `${targetFolder}.jpg`);
      await sharp(portadaFile.path)
        .jpeg({ quality: 90 })
        .toFile(portadaDestJpg);
      fs.unlinkSync(portadaFile.path);
      res.json({ message: 'Imágenes y portada subidas y renombradas correctamente.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

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

  // Eliminar una skin y sus imágenes asociadas
  app.delete('/shop/:id', async (req, res) => {
    console.log('DELETE /shop/:id called with id:', req.params.id);
    try {
      const skin = await Shop.findByPk(req.params.id);
      if (!skin) {
        console.log('Skin no encontrada para id:', req.params.id);
        return res.status(404).json({ message: 'Skin no encontrada' });
      }
      // Guardar nombre de la skin antes de borrar
      const skinName = skin.skin_name;
      console.log('Skin encontrada:', skinName);
      // Eliminar de la BBDD
      await skin.destroy();
      console.log('Entrada eliminada de la BBDD');
      // Eliminar carpeta de imágenes de la skin
      const folderPath = path.join(__dirname, '../imagenes/shop', skinName);
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log('Carpeta de imágenes eliminada:', folderPath);
      } else {
        console.log('No existe carpeta de imágenes para:', folderPath);
      }
      // Eliminar portada
      const portadaPath = path.join(__dirname, '../imagenes/shop/Portadas', `${skinName}.jpg`);
      if (fs.existsSync(portadaPath)) {
        fs.unlinkSync(portadaPath);
        console.log('Portada eliminada:', portadaPath);
      } else {
        console.log('No existe portada para:', portadaPath);
      }
      res.json({ message: 'Skin eliminada junto a sus imágenes.' });
    } catch (error) {
      console.error('Error al eliminar skin:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Endpoint para descargar un zip de una skin
  app.get('/shop/zip/:skinName', (req, res) => {
    const rawName = req.params.skinName;
    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const folderPath = path.join(__dirname, '../imagenes/shop', capitalizedName);
  
    // Verifica que la carpeta existe
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ message: `Carpeta para skin "${capitalizedName}" no encontrada.` });
    }
  
    // Configura el nombre del zip y encabezados de descarga
    const zipName = `${capitalizedName}.zip`;
    res.setHeader('Content-Disposition', `attachment; filename=${zipName}`);
    res.setHeader('Content-Type', 'application/zip');
  
    // Crea y envía el zip directamente al cliente
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
  
    archive.on('error', (err) => {
      res.status(500).send({ error: err.message });
    });
  
    archive.pipe(res);
    archive.directory(folderPath, capitalizedName);
    archive.finalize();
  });
  

  const port = process.env.SHOP_PORT || 3009;
  app.listen(port, () => {
    console.log(`Shop service running on port ${port}`);
  });
};

module.exports = { startShopService };

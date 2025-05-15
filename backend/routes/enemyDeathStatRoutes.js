const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const { Op } = require('sequelize'); // Importamos Op para usar operadores
const EnemyDeathStat = require('../models/EnemyDeathStat');

const router = express.Router();

// ================= ENDPOINTS PARA REGISTRAR MUERTES =================

// Endpoint para registrar una muerte de enemigo o jefe
router.post('/enemyDeaths', async (req, res) => {
  try {
    const { enemy_name, bossName, nickname } = req.body;
    
    // Validación básica
    if (!nickname) {
      return res.status(400).json({ error: 'El nickname del jugador es obligatorio' });
    }
    
    if (!enemy_name && !bossName) {
      return res.status(400).json({ error: 'Debe especificarse al menos un enemigo o jefe' });
    }
    
    // Crear el registro en la base de datos
    const newDeathStat = await EnemyDeathStat.create({
      enemy_name,
      bossName,
      nickname,
      death_time: new Date() // Fecha y hora actual
    });
    
    // Ejecutar el script de estadísticas para actualizar los gráficos
    runStatsScript();
    
    res.status(201).json({
      message: 'Muerte registrada correctamente',
      data: newDeathStat
    });
  } catch (error) {
    console.error('Error al registrar muerte:', error);
    res.status(500).json({ error: 'Error al registrar la muerte', details: error.message });
  }
});

// Endpoint para obtener todas las muertes
router.get('/enemyDeaths', async (req, res) => {
  try {
    const deaths = await EnemyDeathStat.findAll();
    res.status(200).json(deaths);
  } catch (error) {
    console.error('Error al obtener estadísticas de muertes:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas', details: error.message });
  }
});

// Endpoint para obtener muertes por jugador
router.get('/enemyDeaths/player/:nickname', async (req, res) => {
  try {
    const { nickname } = req.params;
    const deaths = await EnemyDeathStat.findAll({
      where: { nickname }
    });
    res.status(200).json(deaths);
  } catch (error) {
    console.error('Error al obtener estadísticas de muertes del jugador:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas', details: error.message });
  }
});

// Endpoint para obtener todas las muertes de enemigos (no jefes)
router.get('/enemyDeaths/enemies', async (req, res) => {
  try {
    const deaths = await EnemyDeathStat.findAll({
      where: {
        enemy_name: {
          [Op.ne]: null
        }
      }
    });
    res.status(200).json(deaths);
  } catch (error) {
    console.error('Error al obtener estadísticas de muertes de enemigos:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas', details: error.message });
  }
});

// Endpoint para obtener todas las muertes de jefes
router.get('/enemyDeaths/bosses', async (req, res) => {
  try {
    const deaths = await EnemyDeathStat.findAll({
      where: {
        bossName: {
          [Op.ne]: null
        }
      }
    });
    res.status(200).json(deaths);
  } catch (error) {
    console.error('Error al obtener estadísticas de muertes de jefes:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas', details: error.message });
  }
});

// ================= ENDPOINTS PARA IMÁGENES DE ESTADÍSTICAS =================

// Endpoint para servir la imagen de muertes por enemigo
router.get('/enemy-death-stats/image', (req, res) => {
  const imgPath = path.resolve(__dirname, '../stat_images/deaths_per_enemy.png');
  res.sendFile(imgPath, err => {
    if (err) {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
});

// Endpoint para servir la imagen de muertes por día
router.get('/enemy-death-stats/image/day', (req, res) => {
  const imgPath = path.resolve(__dirname, '../stat_images/deaths_per_day.png');
  res.sendFile(imgPath, err => {
    if (err) {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
});

// Endpoint para servir la imagen de muertes por usuario/jugador
router.get('/enemy-death-stats/image/user', (req, res) => {
  const imgPath = path.resolve(__dirname, '../stat_images/deaths_per_user.png');
  res.sendFile(imgPath, err => {
    if (err) {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
});

// Endpoint para servir la imagen de muertes por boss
router.get('/enemy-death-stats/image/boss', (req, res) => {
  const imgPath = path.resolve(__dirname, '../stat_images/deaths_per_boss.png');
  res.sendFile(imgPath, err => {
    if (err) {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
});

// Ejecutar el script de Python al iniciar el servicio
function runStatsScript() {
  const scriptPath = path.resolve(__dirname, '../scripts/generate_enemy_death_stats.py');
  exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando el script de estadísticas: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
}

const startEnemyDeathStatService = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use('/', router);

  // Servir la carpeta de imágenes estáticas
  app.use('/stat_images', express.static(path.resolve(__dirname, '../stat_images')));

  // Ejecutar el script de estadísticas al iniciar
  runStatsScript();

  const ENEMY_DEATH_STAT_PORT = process.env.ENEMY_DEATH_STAT_PORT || 3010;
  app.listen(ENEMY_DEATH_STAT_PORT, () => {
    console.log(`EnemyDeathStat service running on port ${ENEMY_DEATH_STAT_PORT}`);
  });
};

module.exports = { router, startEnemyDeathStatService };
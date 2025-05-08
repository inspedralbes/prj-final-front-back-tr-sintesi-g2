const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const EnemyDeathStat = require('../models/EnemyDeathStat');

const router = express.Router();



// Endpoint para servir la imagen de estadísticas generada
router.get('/enemy-death-stats/image', (req, res) => {
  const imgPath = path.resolve(__dirname, '../stat_images/deaths_per_enemy.png');
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

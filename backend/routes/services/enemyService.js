// services/playerService.js
require('dotenv').config({ path: '../environment/.env' });
const { startEnemyService } = require('../enemyRoutes');
startEnemyService();

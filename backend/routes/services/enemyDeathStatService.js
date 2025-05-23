require('dotenv').config({ path: '../environment/.env' });
const { startEnemyDeathStatService } = require('../enemyDeathStatRoutes');
startEnemyDeathStatService();
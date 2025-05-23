// services/playerService.js
require('dotenv').config({ path: '../environment/.env' });
const { startBossService } = require('../bossRoutes');
startBossService();


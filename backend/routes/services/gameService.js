// services/playerService.js
require('dotenv').config({ path: '../environment/.env' });
const { startGameService } = require('../gameRoutes');
startGameService();


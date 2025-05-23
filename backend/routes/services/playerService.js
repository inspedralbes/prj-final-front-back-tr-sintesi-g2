// services/playerService.js
require('dotenv').config({ path: '../environment/.env' });
const { startPlayerService } = require('../playerRoutes');
startPlayerService();

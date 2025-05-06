// services/playerService.js
require('dotenv').config({ path: '../environment/.env' });
const { startShopService } = require('../shopRoutes');
startShopService();


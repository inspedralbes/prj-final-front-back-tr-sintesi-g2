// services/playerService.js
require('dotenv').config({ path: '../environment/.env' });
const { startInventoryService } = require('../inventoryRoutes');
startInventoryService();


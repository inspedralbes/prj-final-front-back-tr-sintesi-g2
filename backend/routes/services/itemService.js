// services/playerService.js
require('dotenv').config({ path: '../environment/.env' });
const { startItemService } = require('../itemRoutes');
startItemService();


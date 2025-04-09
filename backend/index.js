const { createServer } = require('http');
const path = require('path');
const sequelize = require('./config/database');
const createDB = require('./configDB');

// Importar solo las funciones de inicio de los servicios
const { startPlayerService } = require('./routes/playerRoutes');
const { startGameService } = require('./routes/gameRoutes');
const { startInventoryService } = require('./routes/inventoryRoutes');
const { startUserService } = require('./routes/userRoutes');
const { startEnemyService } = require('./routes/enemyRoutes');
const { startBossService } = require('./routes/bossRoutes')
const { startShopService } = require('./routes/shopRoutes')

require('dotenv').config({ path: './environment/.env' });

// Inicializar base de datos y servicios
(async () => {
  try {
    await createDB();
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Iniciar todos los microservicios
    startPlayerService();
    startGameService();
    startInventoryService();
    startUserService();
    startEnemyService();
    startBossService();
    startShopService();
    
    console.log('Todos los servicios iniciados correctamente');
  } catch (error) {
    console.error('Error:', error);
  }
})();
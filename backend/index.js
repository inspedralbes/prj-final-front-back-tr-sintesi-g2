const { createServer } = require('http');
const path = require('path');
const sequelize = require('./config/database');
const ensureDatabaseExists = require('./config/ensureDB');
const seedItems = require('./inserts/seedItems');

// Servicios
const { startPlayerService } = require('./routes/playerRoutes');
const { startGameService } = require('./routes/gameRoutes');
const { startInventoryService } = require('./routes/inventoryRoutes');
const { startUserService } = require('./routes/userRoutes');
const { startEnemyService } = require('./routes/enemyRoutes');
const { startBossService } = require('./routes/bossRoutes');
const { startShopService } = require('./routes/shopRoutes');
const { startItemService } = require('./routes/itemRoutes');

require('dotenv').config({ path: './environment/.env' });

(async () => {
  try {
    await ensureDatabaseExists(); // 👈 esto crea la DB si no existe
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await seedItems(); // 👈 esto inserta los items en la DB
    await sequelize.sync({ force: false }); // 👈 esto sincroniza los modelos con la DB

    // Iniciar microservicios
    startPlayerService();
    startGameService();
    startInventoryService();
    startUserService();
    startEnemyService();
    startBossService();
    startShopService();
    startItemService();

    console.log('Todos los servicios iniciados correctamente');
  } catch (error) {
    console.error('Error:', error);
  }
})();

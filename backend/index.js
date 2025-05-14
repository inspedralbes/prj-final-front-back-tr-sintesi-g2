const { createServer } = require('http');
const path = require('path');
const sequelize = require('./config/database');
const ensureDatabaseExists = require('./config/ensureDB');
const seedItems = require('./inserts/seedItems');
const seedGames = require('./inserts/seedGames');
const seedPlayers = require('./inserts/seedPlayers');
const seedEnemies = require('./inserts/seedEnemies');
const seedBosses = require('./inserts/seedBosses');
const seedInventory = require('./inserts/seedInventory');
const seedShop = require('./inserts/seedShop');
const seedEnemyDeathStats = require('./inserts/seedEnemyDeathStats');

// Servicios
const { startPlayerService } = require('./routes/playerRoutes');
const { startGameService } = require('./routes/gameRoutes');
const { startInventoryService } = require('./routes/inventoryRoutes');
const { startUserService } = require('./routes/userRoutes');
const { startEnemyService } = require('./routes/enemyRoutes');
const { startBossService } = require('./routes/bossRoutes');
const { startShopService } = require('./routes/shopRoutes');
const { startItemService } = require('./routes/itemRoutes');
const { startEnemyDeathStatService } = require('./routes/enemyDeathStatRoutes');

require('./routes/serviceController');

require('dotenv').config({ path: './environment/.env' });

(async () => {
  try {
    await ensureDatabaseExists(); // 👈 esto crea la DB si no existe
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync({ force: false }); // 👈 esto sincroniza los modelos con la DB
    // Iniciar microservicios
    startPlayerService();
    startGameService();
    startInventoryService();
    startUserService();
    startEnemyDeathStatService();
    startEnemyService();
    startBossService();
    startShopService();
    startItemService();
    
    await seedItems(); // 👈 esto inserta los items en la DB
    //await seedGames(); // 👈 esto inserta los juegos en la DB
    //await seedPlayers(); // 👈 esto inserta los jugadores en la DB
    //await seedEnemies(); // 👈 esto inserta los enemigos en la DB
    //await seedBosses(); // 👈 esto inserta los jefes en la DB
    //await seedInventory(); // 👈 esto inserta los inventarios en la DB
    //await seedShop(); // 👈 esto inserta los tiendas en la DB
    //await seedEnemyDeathStats(); // 👈 esto inserta las estadísticas de muertes en la DB
    console.log('Todos los servicios iniciados correctamente');
  } catch (error) {
    console.error('Error:', error);
  }
})();

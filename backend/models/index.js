const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos
const User = require('./User');
const Shop = require('./Shop');
const Boss = require('./Boss');
const Enemy = require('./Enemy');
const Game = require('./Game');
const Inventory = require('./Inventory');
const Item = require('./Item');
const Player = require('./Player');

// Definir relaciones entre modelos
// Player - User (un usuario puede tener varios jugadores)
User.hasMany(Player, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Player.belongsTo(User, { foreignKey: 'user_id' });

// Player - Inventory (un jugador tiene un inventario)
Player.hasOne(Inventory, { foreignKey: 'player_id', onDelete: 'CASCADE' });
Inventory.belongsTo(Player, { foreignKey: 'player_id' });

// Inventory - Item (un inventario puede tener muchos items)
Inventory.belongsToMany(Item, { through: 'inventory_items', foreignKey: 'inventory_id' });
Item.belongsToMany(Inventory, { through: 'inventory_items', foreignKey: 'item_id' });

// Shop - Item (una tienda puede tener muchos items)
Shop.belongsToMany(Item, { through: 'shop_items', foreignKey: 'shop_id' });
Item.belongsToMany(Shop, { through: 'shop_items', foreignKey: 'item_id' });

// Game - Player (un juego puede tener muchos jugadores)
Game.hasMany(Player, { foreignKey: 'game_id', onDelete: 'CASCADE' });
Player.belongsTo(Game, { foreignKey: 'game_id' });

// Game - Boss (un juego puede tener muchos jefes)
Game.hasMany(Boss, { foreignKey: 'game_id', onDelete: 'CASCADE' });
Boss.belongsTo(Game, { foreignKey: 'game_id' });

// Game - Enemy (un juego puede tener muchos enemigos)
Game.hasMany(Enemy, { foreignKey: 'game_id', onDelete: 'CASCADE' });
Enemy.belongsTo(Game, { foreignKey: 'game_id' });

// Exportar modelos y sequelize
module.exports = {
    sequelize,
    User,
    Shop,
    Boss,
    Enemy,
    Game,
    Inventory,
    Item,
    Player
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Player = require('./Player');
const Item = require('./Item');

const Inventory = sequelize.define('Inventory', {
  id_player: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Player,
      key: 'id_player'
    }
  },
  id_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Item,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'inventory',
  timestamps: false
});

Inventory.belongsTo(Player, { foreignKey: 'id_player' });
Inventory.belongsTo(Item, { foreignKey: 'id_item' });
Player.hasMany(Inventory, { foreignKey: 'id_player' });
Item.hasMany(Inventory, { foreignKey: 'id_item' });

module.exports = Inventory;

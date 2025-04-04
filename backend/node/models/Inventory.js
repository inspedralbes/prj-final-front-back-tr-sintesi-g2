const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Player = require('./Player');
const Item = require('./Item');

const Inventory = sequelize.define('Inventory', {
  id_inventory: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Player,
      key: 'id_player'
    }
  },
  id_item: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Item,
      key: 'id_item'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'INVENTORY',
  timestamps: false
});

// Definir las relaciones
Inventory.belongsTo(Player, { 
  foreignKey: 'player_id',
  onDelete: 'CASCADE'
});

Inventory.belongsTo(Item, { 
  foreignKey: 'id_item',
  onDelete: 'CASCADE'
});

Player.hasMany(Inventory, { 
  foreignKey: 'player_id',
  onDelete: 'CASCADE'
});

Item.hasMany(Inventory, { 
  foreignKey: 'id_item',
  onDelete: 'CASCADE'
});

module.exports = Inventory;

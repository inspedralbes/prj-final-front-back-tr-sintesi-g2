const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Player = require('./Player');
const Inventory = require('./Inventory');

const Game = sequelize.define('Game', {
  id_game: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_player: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Player,
      key: 'id_player'
    }
  },
  id_inventory: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Inventory,
      key: 'id_inventory'
    }
  },
  game_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  game_status: {
    type: DataTypes.ENUM('active', 'completed'),
    defaultValue: 'active'
  },
  total_progress: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  last_save_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  position_x: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  position_y: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  health: {
    type: DataTypes.INTEGER,
    defaultValue: 70
  },
  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  time_played: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'GAME',
  timestamps: false
});

// Definir las relaciones
Game.belongsTo(Player, { 
  foreignKey: 'id_player',
  onDelete: 'CASCADE'
});

Game.belongsTo(Inventory, {
  foreignKey: 'id_inventory',
  onDelete: 'CASCADE'
});

Player.hasMany(Game, { 
  foreignKey: 'id_player',
  onDelete: 'CASCADE'
});

Inventory.hasMany(Game, {
  foreignKey: 'id_inventory',
  onDelete: 'CASCADE'
});

module.exports = Game;

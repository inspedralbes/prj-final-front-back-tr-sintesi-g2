const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Player = require('./Player');

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
  game_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  game_status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  total_progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0.00
  },
  time_played: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  position_x: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  position_y: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  health: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'GAME',
  timestamps: false
});

Game.belongsTo(Player, { foreignKey: 'id_player' });
Player.hasMany(Game, { foreignKey: 'id_player' });

module.exports = Game;

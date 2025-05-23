const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
  id_player: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  selectedSkin: {
    type: DataTypes.STRING(50),
    defaultValue: "John"
  },
  purchasedSkins: {
    type: DataTypes.JSON,
    defaultValue: ["John"]
  },  
  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total_time_played: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  achievements_unlocked: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'player',
  timestamps: false
});

module.exports = Player;

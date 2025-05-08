const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EnemyDeathStat = sequelize.define('EnemyDeathStat', {
  id_enemy_death_stat: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  enemy_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  boss_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  player_nickname: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  death_time: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'enemy_death_stat',
  timestamps: false
});

module.exports = EnemyDeathStat;

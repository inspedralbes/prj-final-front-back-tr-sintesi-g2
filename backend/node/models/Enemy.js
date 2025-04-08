const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enemy = sequelize.define('Enemy', {
  id_enemy: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  enemy_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  move_speed: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  enemy_max_health: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  follow_range: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  attack_range: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  hit_damage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attack_damage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  second_attack_damage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  block_chance: {
    type: DataTypes.FLOAT
  },
  reduced_damage: {
    type: DataTypes.INTEGER
  },
  attack_cooldown: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  coin_reward: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Enemy;

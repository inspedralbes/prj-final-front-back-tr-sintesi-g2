const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Boss = sequelize.define('Boss', {
  bossName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bossMaxHealth: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  moveSpeed: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  attackRange: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  attackCooldown: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  attack1Damage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attack2Damage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  visionRange: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  disintegrationTime: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Boss;
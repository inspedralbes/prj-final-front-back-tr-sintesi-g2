const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  item_description: {
    type: DataTypes.TEXT
  },
  item_type: {
    type: DataTypes.ENUM('pocion', 'llave'),
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rarity: {
    type: DataTypes.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
    defaultValue: 'common'
  },
  item_image: {
    type: DataTypes.STRING(255),
    defaultValue: null
  }
}, {
  tableName: 'item',
  timestamps: false
});

module.exports = Item;

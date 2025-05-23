const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shop = sequelize.define('Shop', {
  id_skin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  skin_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'shop',
  timestamps: true
});

module.exports = Shop;

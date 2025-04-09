const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Boss = sequelize.define('Boss', {
  id_boss: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_game: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  boss_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  boss_max_health: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  move_speed: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  attack_range: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  attack_cooldown: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  attack1_damage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attack2_damage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vision_range: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100)
  },
  reward_item: {
    type: DataTypes.INTEGER
  },
  is_defeated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  tableName: 'boss',
  timestamps: false
});

// Define associations
Boss.associate = (models) => {
  Boss.belongsTo(models.Game, {
    foreignKey: 'id_game',
    onDelete: 'CASCADE'
  });
  Boss.belongsTo(models.Item, {
    foreignKey: 'reward_item',
    onDelete: 'SET NULL'
  });
};

module.exports = Boss;

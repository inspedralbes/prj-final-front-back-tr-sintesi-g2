const Boss = require('../models/Boss');

const seedBosses = async () => {
  const bosses = [
    {
      bossName: 'The Witch',
      bossMaxHealth: 5000,
      moveSpeed: 1.2,
      attackRange: 5.0,
      attackCooldown: 2.5,
      attack1Damage: 150,
      attack2Damage: 300,
      visionRange: 10.0,
      disintegrationTime: 2.5
    },
    {
      bossName: 'Jefe Oscuro',
      bossMaxHealth: 3500,
      moveSpeed: 1.0,
      attackRange: 3.0,
      attackCooldown: 3.0,
      attack1Damage: 100,
      attack2Damage: 200,
      visionRange: 8.0,
      disintegrationTime: 2.0
    },
    {
      bossName: 'mago fuego',
      bossMaxHealth: 2500,
      moveSpeed: 1.8,
      attackRange: 2.0,
      attackCooldown: 1.8,
      attack1Damage: 80,
      attack2Damage: 150,
      visionRange: 7.5,
      disintegrationTime: 1.8
    },
    {
      bossName: 'Hechicero del Abismo',
      bossMaxHealth: 4000,
      moveSpeed: 0.9,
      attackRange: 6.0,
      attackCooldown: 2.0,
      attack1Damage: 120,
      attack2Damage: 220,
      visionRange: 12.0,
      disintegrationTime: 2.2
    }
  ];

  await Boss.bulkCreate(bosses, { ignoreDuplicates: true });
  console.log('Bosses insertados correctamente');
};

module.exports = seedBosses;

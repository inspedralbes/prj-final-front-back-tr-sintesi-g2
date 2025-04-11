const Boss = require('../models/Boss');

const seedBosses = async () => {
  const bosses = [
    {
      boss_name: 'Dragón Infernal',
      boss_max_health: 5000,
      move_speed: 1.2,
      attack_range: 5.0,
      attack_cooldown: 2.5,
      attack1_damage: 150,
      attack2_damage: 300,
      vision_range: 10.0,
      reward_item: 8 // ID del ítem: Llave Dragón
    },
    {
      boss_name: 'Rey Esqueleto',
      boss_max_health: 3500,
      move_speed: 1.0,
      attack_range: 3.0,
      attack_cooldown: 3.0,
      attack1_damage: 100,
      attack2_damage: 200,
      vision_range: 8.0,
      reward_item: 6 // ID del ítem: Llave Esqueleto
    },
    {
      boss_name: 'Lobo Alfa',
      boss_max_health: 2500,
      move_speed: 1.8,
      attack_range: 2.0,
      attack_cooldown: 1.8,
      attack1_damage: 80,
      attack2_damage: 150,
      vision_range: 7.5,
      reward_item: 7 // ID del ítem: Llave Lobo
    },
    {
      boss_name: 'Hechicero del Abismo',
      boss_max_health: 4000,
      move_speed: 0.9,
      attack_range: 6.0,
      attack_cooldown: 2.0,
      attack1_damage: 120,
      attack2_damage: 220,
      vision_range: 12.0,
      reward_item: 5 // ID del ítem: Llave Dorada
    }
  ];

  await Boss.bulkCreate(bosses, { ignoreDuplicates: true });
  console.log('Bosses insertados correctamente');
};

module.exports = seedBosses;

const Enemy = require('../models/Enemy');

const seedEnemies = async () => {
  const enemies = [
    {
      enemy_name: 'Goblin',
      move_speed: 1.5,
      enemy_max_health: 100,
      follow_range: 6.0,
      attack_range: 1.5,
      hit_damage: 10,
      attack_damage: 15,
      second_attack_damage: 5,
      block_chance: 0.1,
      reduced_damage: 3,
      attack_cooldown: 1.2,
      coin_reward: 10
    },
    {
      enemy_name: 'Orco Guerrero',
      move_speed: 1.0,
      enemy_max_health: 250,
      follow_range: 5.0,
      attack_range: 2.0,
      hit_damage: 20,
      attack_damage: 30,
      second_attack_damage: 15,
      block_chance: 0.2,
      reduced_damage: 5,
      attack_cooldown: 1.8,
      coin_reward: 25
    },
    {
      enemy_name: 'Esqueleto Arquero',
      move_speed: 1.3,
      enemy_max_health: 120,
      follow_range: 7.0,
      attack_range: 4.0,
      hit_damage: 0,
      attack_damage: 25,
      second_attack_damage: 0,
      block_chance: 0.0,
      reduced_damage: 0,
      attack_cooldown: 2.0,
      coin_reward: 15
    },
    {
      enemy_name: 'Slime Gigante',
      move_speed: 0.8,
      enemy_max_health: 300,
      follow_range: 3.5,
      attack_range: 1.0,
      hit_damage: 5,
      attack_damage: 10,
      second_attack_damage: 10,
      block_chance: 0.3,
      reduced_damage: 8,
      attack_cooldown: 2.5,
      coin_reward: 20
    }
  ];

  await Enemy.bulkCreate(enemies, { ignoreDuplicates: true });
  console.log('Enemigos insertados correctamente');
};

module.exports = seedEnemies;

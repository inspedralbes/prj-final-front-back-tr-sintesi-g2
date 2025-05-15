const Enemy = require('../models/Enemy');

const seedEnemies = async () => {
  const enemies = [
    {
      enemy_name: 'GoblinEnemy',
      move_speed: 2,
      enemy_max_health: 50,
      follow_range: 10,
      attack_range: 1.5,
      hit_damage: 25,
      attack_damage: 10,
      second_attack_damage: 20,
      block_chance: null,
      reduced_damage: null,
      attack_cooldown: 2,
      coin_reward: 5
    },
    {
      enemy_name: 'FlyingEyeEnemy1',
      move_speed: 2,
      enemy_max_health: 100,
      follow_range: 10,
      attack_range: 1.5,
      hit_damage: 25,
      attack_damage: 10,
      second_attack_damage: 20,
      block_chance: null,
      reduced_damage: null,
      attack_cooldown: 2,
      coin_reward: 5
    },
    {
      enemy_name: 'Skeleton',
      move_speed: 2,
      enemy_max_health: 50,
      follow_range: 10,
      attack_range: 1.5,
      hit_damage: 25,
      attack_damage: 10,
      second_attack_damage: 15,
      block_chance: 0.4,
      reduced_damage: 5,
      attack_cooldown: 2,
      coin_reward: 5
    },
    {
      enemy_name: 'MushroomEnemy',
      move_speed: 2,
      enemy_max_health: 50,
      follow_range: 2,
      attack_range: 1.5,
      hit_damage: 25,
      attack_damage: 10,
      second_attack_damage: 20,
      block_chance: null,
      reduced_damage: null,
      attack_cooldown: 2.5,
      coin_reward: 20
    },
    {
      enemy_name: 'HeavyBanditEnemy',
      move_speed: 2,
      enemy_max_health: 100,
      follow_range: 10,
      attack_range: 1.5,
      hit_damage: 25,
      attack_damage: 15,
      second_attack_damage: null,
      block_chance: null,
      reduced_damage: null,
      attack_cooldown: 1.8,
      coin_reward: 8
    },
    {
      enemy_name: 'LightBanditEnemy',
      move_speed: 2,
      enemy_max_health: 100,
      follow_range: 10,
      attack_range: 1.5,
      hit_damage: 25,
      attack_damage: 15,
      second_attack_damage: null,
      block_chance: null,
      reduced_damage: null,
      attack_cooldown: 1.8,
      coin_reward: 8
    },
    {
      enemy_name: 'MedievalEnemy',
      move_speed: 2,
      enemy_max_health: 50,
      follow_range: 10,
      attack_range: 1.5,
      hit_damage: 25,
      attack_damage: 10,
      second_attack_damage: 20,
      block_chance: null,
      reduced_damage: null,
      attack_cooldown: 2,
      coin_reward: 5
    }

  ];

  await Enemy.bulkCreate(enemies, { ignoreDuplicates: true });
  console.log('Enemigos insertados correctamente');
};

module.exports = seedEnemies;

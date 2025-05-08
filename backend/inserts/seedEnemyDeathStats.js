const EnemyDeathStat = require('../models/EnemyDeathStat');

const seedEnemyDeathStats = async () => {
  const stats = [
    // Ejemplo: un enemigo muerto
    {
      enemy_name: 'Goblin',
      boss_name: null,
      player_nickname: 'Jugador2',
      death_time: new Date('2025-05-07T08:30:00+02:00')
    },
    // Ejemplo: un boss muerto
    {
      enemy_name: null,
      boss_name: 'Dragón Infernal',
      player_nickname: 'Jugador3',
      death_time: new Date('2025-05-07T08:45:00+02:00')
    },
    // Otro enemigo
    {
      enemy_name: 'Orco Guerrero',
      boss_name: null,
      player_nickname: 'Jugador4',
      death_time: new Date('2025-05-07T08:47:00+02:00')
    }
  ];

  await EnemyDeathStat.bulkCreate(stats);
  console.log('EnemyDeathStats seeded!');
};

module.exports = seedEnemyDeathStats;

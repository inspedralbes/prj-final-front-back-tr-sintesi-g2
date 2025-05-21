const EnemyDeathStat = require('../models/EnemyDeathStat');

const seedEnemyDeathStats = async () => {
  const stats = [
    // Día 1
    { enemy_name: 'Goblin', bossName: null, nickname: 'Jugador1', death_time: new Date('2025-05-07T08:10:00+02:00') },
    { enemy_name: 'Goblin', bossName: null, nickname: 'Jugador2', death_time: new Date('2025-05-07T08:30:00+02:00') },
    { enemy_name: 'Orco Guerrero', bossName: null, nickname: 'Jugador1', death_time: new Date('2025-05-07T09:00:00+02:00') },
    { enemy_name: null, bossName: 'Dragón Infernal', nickname: 'Jugador3', death_time: new Date('2025-05-07T10:45:00+02:00') },
    { enemy_name: null, bossName: 'Señor de las Sombras', nickname: 'Jugador2', death_time: new Date('2025-05-07T11:00:00+02:00') },
    // Día 2
    { enemy_name: 'Goblin', bossName: null, nickname: 'Jugador4', death_time: new Date('2025-05-08T08:15:00+02:00') },
    { enemy_name: 'Orco Guerrero', bossName: null, nickname: 'Jugador2', death_time: new Date('2025-05-08T09:20:00+02:00') },
    { enemy_name: 'Esqueleto', bossName: null, nickname: 'Jugador3', death_time: new Date('2025-05-08T11:10:00+02:00') },
    { enemy_name: null, bossName: 'Reina Araña', nickname: 'Jugador4', death_time: new Date('2025-05-08T12:00:00+02:00') },
    // Día 3
    { enemy_name: 'Goblin', bossName: null, nickname: 'Jugador1', death_time: new Date('2025-05-09T08:05:00+02:00') },
    { enemy_name: 'Esqueleto', bossName: null, nickname: 'Jugador2', death_time: new Date('2025-05-09T08:30:00+02:00') },
    { enemy_name: 'Orco Guerrero', bossName: null, nickname: 'Jugador3', death_time: new Date('2025-05-09T09:40:00+02:00') },
    { enemy_name: null, bossName: 'Señor de las Sombras', nickname: 'Jugador4', death_time: new Date('2025-05-09T10:00:00+02:00') },
    { enemy_name: null, bossName: 'Reina Araña', nickname: 'Jugador1', death_time: new Date('2025-05-09T11:15:00+02:00') },
    // Día 4
    { enemy_name: 'Goblin', bossName: null, nickname: 'Jugador2', death_time: new Date('2025-05-10T08:40:00+02:00') },
    { enemy_name: 'Orco Guerrero', bossName: null, nickname: 'Jugador4', death_time: new Date('2025-05-10T09:30:00+02:00') },
    { enemy_name: 'Esqueleto', bossName: null, nickname: 'Jugador1', death_time: new Date('2025-05-10T10:10:00+02:00') },
    { enemy_name: null, bossName: 'Dragón Infernal', nickname: 'Jugador3', death_time: new Date('2025-05-10T11:45:00+02:00') },
    { enemy_name: null, bossName: 'Reina Araña', nickname: 'Jugador2', death_time: new Date('2025-05-10T12:50:00+02:00') },
    // Día 5
    { enemy_name: 'Goblin', bossName: null, nickname: 'Jugador3', death_time: new Date('2025-05-11T08:25:00+02:00') },
    { enemy_name: 'Orco Guerrero', bossName: null, nickname: 'Jugador2', death_time: new Date('2025-05-11T09:15:00+02:00') },
    { enemy_name: 'Esqueleto', bossName: null, nickname: 'Jugador4', death_time: new Date('2025-05-11T10:30:00+02:00') },
    { enemy_name: null, bossName: 'Señor de las Sombras', nickname: 'Jugador1', death_time: new Date('2025-05-11T11:00:00+02:00') },
    { enemy_name: null, bossName: 'Dragón Infernal', nickname: 'Jugador4', death_time: new Date('2025-05-11T12:10:00+02:00') }
  ];

  await EnemyDeathStat.bulkCreate(stats);
  console.log('EnemyDeathStats seeded!');
};

module.exports = seedEnemyDeathStats;

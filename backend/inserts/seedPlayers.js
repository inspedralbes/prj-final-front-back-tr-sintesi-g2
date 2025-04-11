const Player = require('../models/Player');

const seedPlayers = async () => {
  const players = [
    {
      nickname: 'AlexRPG',
      creation_date: new Date('2024-12-15'),
      total_time_played: 4520,
      achievements_unlocked: 5
    },
    {
      nickname: 'MagaOscura',
      creation_date: new Date('2025-01-10'),
      total_time_played: 7890,
      achievements_unlocked: 8
    },
    {
      nickname: 'LoboSol',
      creation_date: new Date('2025-03-05'),
      total_time_played: 1230,
      achievements_unlocked: 2
    },
    {
      nickname: 'DragonsHeart',
      creation_date: new Date('2025-04-01'),
      total_time_played: 3150,
      achievements_unlocked: 4
    }
  ];

  await Player.bulkCreate(players, { ignoreDuplicates: true });
  console.log('Jugadores insertados correctamente');
};

module.exports = seedPlayers;

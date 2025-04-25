const Game = require('../models/Game');

const seedGames = async () => {
  const game = [
    {
      id_player: 1,
      id_inventory: 1,
      game_name: 'Aventura de Alex',
      game_status: 'active',
      total_progress: 15.75,
      last_save_date: new Date(),
      position_x: 120.5,
      position_y: 84.3,
      health: 60,
      coins: 120,
      time_played: 360 // en segundos
    },
    {
      id_player: 2,
      id_inventory: 2,
      game_name: 'La Mazmorra Maldita',
      game_status: 'completed',
      total_progress: 100.00,
      last_save_date: new Date(),
      position_x: 0,
      position_y: 0,
      health: 0,
      coins: 560,
      time_played: 5800
    },
    {
      id_player: 3,
      id_inventory: 3,
      game_name: 'Rescate en el Bosque',
      game_status: 'active',
      total_progress: 42.30,
      last_save_date: new Date(),
      position_x: 300.25,
      position_y: 45.0,
      health: 75,
      coins: 340,
      time_played: 2100
    }
  ];

  await Game.bulkCreate(game, { ignoreDuplicates: true });
  console.log('Juegos insertados correctamente');
};

module.exports = seedGames;

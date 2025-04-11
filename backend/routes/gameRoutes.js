const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Game = require('../models/Game');
const Inventory = require('../models/Inventory');

router.post('/newGame', async (req, res) => {
  const {
    nickname,
    game_name,
    game_status = 'active',
    total_progress = 0.00,
    time_played = 0,
    position_x = 0,
    position_y = 0,
    health = 100,
    coins = 0
  } = req.body;

  if (!nickname || !game_name) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    const player = await Player.findOne({ where: { nickname } });
    
    if (!player) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const existingGame = await Game.findOne({ 
      where: { id_player: player.id_player } 
    });

    if (existingGame) {
      return res.status(400).send('El jugador ya tiene una partida activa.');
    }

    // Primero crear el inventario inicial usando fetch
    try {
      const response = await fetch('http://localhost:3003/createInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          player_id: player.id_player
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear inventario');
      }

      const data = await response.json();
      const { id_inventory } = data;

      if (!id_inventory) {
        return res.status(500).send('Inventario no creado correctamente.');
      }

      // Ahora crear el juego con el id_inventory
      const game = await Game.create({
        id_player: player.id_player,
        id_inventory,
        game_name,
        game_status,
        total_progress,
        time_played,
        position_x,
        position_y,
        health,
        coins
      });

      res.status(201).json({ message: 'Partida creada con éxito.' });
    } catch (error) {
      console.error('Error al crear inventario:', error);
      return res.status(500).send('Error al crear el inventario inicial.');
    }
  } catch (error) {
    console.error('Error al crear partida:', error);
    res.status(500).send('Error al crear la partida.');
  }
});
router.get('/game', async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [
        {
          model: Player,
          attributes: ['id_player', 'nickname']
        },
        {
          model: Inventory,
          attributes: ['id_inventory']
        }
      ],
      order: [['last_save_date', 'DESC']]
    });

    const mappedGames = games.map(game => ({
      id: game.id_game,
      playerId: game.id_player,
      playerNickname: game.Player.nickname,
      score: parseFloat(game.total_progress),
      time: game.time_played,
      status: game.game_status,
      createdAt: game.last_save_date
    }));

    res.status(200).json(mappedGames);
  } catch (error) {
    console.error('Error al obtener todos los juegos:', error);
    res.status(500).send('Error al obtener los juegos.');
  }
});


router.get('/loadGame/:nickname', async (req, res) => {
  const { nickname } = req.params;

  if (!nickname) {
    return res.status(400).send('Nickname no proporcionado.');
  }

  try {
    const player = await Player.findOne({ 
      where: { nickname },
      include: [{
        model: Game,
        required: false
      }]
    });

    if (!player) {
      return res.status(404).send('Jugador no encontrado.');
    }

    if (!player.Games || player.Games.length === 0) {
      return res.status(404).send('No se encontró ninguna partida para este jugador.');
    }

    res.status(200).json(player.Games[0]);
  } catch (error) {
    console.error('Error al cargar partida:', error);
    res.status(500).send('Error al cargar partida.');
  }
});

router.get('/lastGame/:nickname', async (req, res) => {
  const { nickname } = req.params;

  if (!nickname) {
    return res.status(400).send('Nickname no proporcionado.');
  }

  try {
    const player = await Player.findOne({ where: { nickname } });
    
    if (!player) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const game = await Game.findOne({ 
      where: { id_player: player.id_player },
      include: [{
        model: Inventory,
        attributes: ['id_inventory']
      }],
      order: [['last_save_date', 'DESC']]
    });

    if (!game) {
      return res.status(404).send('No se encontró ninguna partida para este jugador.');
    }

    res.status(200).json({
      game: {
        id_game: game.id_game,
        game_name: game.game_name,
        game_status: game.game_status,
        total_progress: game.total_progress,
        last_save_date: game.last_save_date,
        position_x: game.position_x,
        position_y: game.position_y,
        health: game.health,
        coins: game.coins,
        inventory_id: game.Inventory.id_inventory
      }
    });
  } catch (error) {
    console.error('Error al obtener la última partida:', error);
    res.status(500).send('Error al obtener la última partida.');
  }
});

router.delete('/deleteGame/:nickname', async (req, res) => {
  const { nickname } = req.params;

  if (!nickname) {
    return res.status(400).send('Nickname no proporcionado.');
  }

  try {
    const player = await Player.findOne({ where: { nickname } });
    
    if (!player) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const game = await Game.findOne({ 
      where: { id_player: player.id_player } 
    });

    if (!game) {
      return res.status(404).send('No se encontró ninguna partida para este jugador.');
    }

    // Eliminar el inventario asociado
    await Inventory.destroy({
      where: { id_inventory: game.id_inventory }
    });

    // Eliminar la partida
    await game.destroy();

    res.status(200).json({ message: 'Partida eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar la partida:', error);
    res.status(500).send('Error al eliminar la partida.');
  }
});

router.put('/updateGame/:nickname', async (req, res) => {
  const { nickname } = req.params;
  const {
    game_name,
    game_status,
    total_progress,
    time_played,
    position_x,
    position_y,
    health,
    coins
  } = req.body;

  if (!nickname) {
    return res.status(400).send('Nickname no proporcionado.');
  }

  try {
    const player = await Player.findOne({ where: { nickname } });
    
    if (!player) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const game = await Game.findOne({ 
      where: { id_player: player.id_player } 
    });

    if (!game) {
      return res.status(404).send('No se encontró ninguna partida para este jugador.');
    }

    // Crear objeto con los campos a actualizar
    const updateFields = {};
    if (game_name) updateFields.game_name = game_name;
    if (game_status) updateFields.game_status = game_status;
    if (total_progress !== undefined) updateFields.total_progress = total_progress;
    if (time_played !== undefined) updateFields.time_played = time_played;
    if (position_x !== undefined) updateFields.position_x = position_x;
    if (position_y !== undefined) updateFields.position_y = position_y;
    if (health !== undefined) updateFields.health = health;
    if (coins !== undefined) updateFields.coins = coins;
    updateFields.last_save_date = new Date();

    // Actualizar la partida
    await game.update(updateFields);

    res.status(200).json({ 
      message: 'Partida actualizada con éxito.',
      game: await game.reload()
    });
  } catch (error) {
    console.error('Error al actualizar la partida:', error);
    res.status(500).send('Error al actualizar la partida.');
  }
});

// Crear el servidor de express para el servicio de juegos
const app = express();
app.use(express.json());
app.use(require('cors')());
app.use('/', router);

const GAME_PORT = process.env.GAME_PORT || 3002;

function startGameService() {
  app.listen(GAME_PORT, () => {
    console.log(`Servicio de juegos corriendo en el puerto ${GAME_PORT}`);
  });
}

module.exports = { router, startGameService };

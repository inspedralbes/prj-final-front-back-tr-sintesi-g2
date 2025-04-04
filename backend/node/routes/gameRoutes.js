const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Game = require('../models/Game');

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

    const game = await Game.create({
      id_player: player.id_player,
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
    console.error('Error al crear partida:', error);
    res.status(500).send('Error al crear partida.');
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

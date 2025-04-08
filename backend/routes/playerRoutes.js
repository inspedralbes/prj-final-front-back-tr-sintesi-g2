const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

router.post('/player', async (req, res) => {
  const { nickname } = req.body;

  if (!nickname) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    const player = await Player.create({ nickname });
    res.status(201).json({ message: 'Jugador insertado con éxito.' });
  } catch (error) {
    console.error('Error al insertar jugador:', error);
    res.status(500).send('Error al insertar jugador.');
  }
});

router.post('/loginPlayer', async (req, res) => {
  const { nickname } = req.body;
  
  if (!nickname) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    const player = await Player.findOne({ where: { nickname } });
    
    if (!player) {
      return res.status(404).send('Player no encontrado.');
    }

    res.status(200).json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).send('Error fetching player.');
  }
});

// Crear el servidor de express para el servicio de jugadores
const app = express();
app.use(express.json());
app.use(require('cors')());
app.use('/', router);

const PLAYER_PORT = process.env.PLAYER_PORT || 3001;

function startPlayerService() {
  app.listen(PLAYER_PORT, () => {
    console.log(`Servicio de jugadores corriendo en el puerto ${PLAYER_PORT}`);
  });
}

module.exports = { router, startPlayerService };

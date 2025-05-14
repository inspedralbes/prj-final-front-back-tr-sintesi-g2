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

// Get all players
router.get('/players', async (req, res) => {
  try {
    const players = await Player.findAll();
    res.status(200).json(players);
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    res.status(500).send('Error al obtener jugadores.');
  }
});

// Delete player
router.delete('/player/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).send('Jugador no encontrado.');
    }
    
    await player.destroy();
    res.status(200).json({ message: 'Jugador eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    res.status(500).send('Error al eliminar jugador.');
  }
});
router.get('/player/purchasedskins/:nickname', async (req, res) => {
  const { nickname } = req.params;

  try {
    const player = await Player.findOne({ where: { nickname } });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({ purchasedSkins: player.purchasedSkins });
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/player/addnewskin', async (req, res) => {
  const { nickname, skin } = req.body;

  if (!nickname || !skin) {
    return res.status(400).json({ error: 'Nickname y skin son requeridos.' });
  }

  try {
    // Buscar al jugador en la base de datos
    const player = await Player.findOne({ where: { nickname } });

    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado.' });
    }

    // Verificar si ya tiene la skin
    const purchasedSkins = player.purchasedSkins || [];
    if (purchasedSkins.includes(skin)) {
      return res.status(400).json({ error: 'La skin ya fue comprada.' });
    }

    // Reemplazar el array con uno nuevo (en lugar de mutarlo directamente)
    player.purchasedSkins = [...purchasedSkins, skin];

    // Guardar los cambios en la base de datos
    await player.save();

    res.status(200).json({
      message: 'Skin añadida con éxito.',
      purchasedSkins: player.purchasedSkins,
    });
  } catch (error) {
    console.error('Error al guardar la skin:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


router.put('/player/selectedskin', async (req, res) => {
  const { nickname, selectedSkin } = req.body;

  if (!nickname || !selectedSkin) {
    return res.status(400).json({ error: 'Nickname y selectedSkin son requeridos.' });
  }

  try {
    // Buscar al jugador en la base de datos
    const player = await Player.findOne({ where: { nickname } });

    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado.' });
    }

    // Verificar si la skin seleccionada está en las skins compradas
    const purchasedSkins = player.purchasedSkins || [];
    if (!purchasedSkins.includes(selectedSkin)) {
      return res.status(400).json({ error: 'La skin seleccionada no está comprada.' });
    }

    // Actualizar el campo selectedSkin
    player.selectedSkin = selectedSkin;

    // Guardar los cambios en la base de datos
    await player.save();

    res.status(200).json({
      message: 'Skin seleccionada actualizada con éxito.',
      selectedSkin: player.selectedSkin,
    });
  } catch (error) {
    console.error('Error al actualizar la skin seleccionada:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
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

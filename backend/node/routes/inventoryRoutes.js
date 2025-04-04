const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');

router.put('/updateInventory/:nickname', async (req, res) => {
  const { nickname } = req.params;
  const { id_item, quantity } = req.body;

  if (!id_item || quantity === undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    const player = await Player.findOne({ where: { nickname } });
    
    if (!player) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const item = await Item.findByPk(id_item);
    if (!item) {
      return res.status(404).send('Item no encontrado.');
    }

    const [inventory, created] = await Inventory.findOrCreate({
      where: { id_player: player.id_player, id_item },
      defaults: { quantity: 0 }
    });

    await inventory.update({ quantity });
    
    res.status(200).json({ message: 'Inventario actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    res.status(500).send('Error al actualizar inventario.');
  }
});

// Crear el servidor de express para el servicio de inventario
const app = express();
app.use(express.json());
app.use(require('cors')());
app.use('/', router);

const INVENTORY_PORT = process.env.INVENTORY_PORT || 3003;

function startInventoryService() {
  app.listen(INVENTORY_PORT, () => {
    console.log(`Servicio de inventario corriendo en el puerto ${INVENTORY_PORT}`);
  });
}

module.exports = { router, startInventoryService };

const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');

// Crear inventario inicial con ítems predeterminados
router.post('/createInventory', async (req, res) => {
  const { player_id } = req.body;

  if (!player_id) {
    return res.status(400).json({ message: 'player_id requerido' });
  }

  const initialItems = [1, 2, 3, 4, 5, 6, 7, 8];

  try {
    const createdItems = await Promise.all(
      initialItems.map(async (item_id) => {
        return await Inventory.create({
          player_id,
          id_item: item_id,
          quantity: 1
        });
      })
    );

    // Devolver solo el primero como id_inventory (o podrías devolver todos si querés)
    const id_inventory = createdItems[0]?.id_inventory || null;

    res.status(201).json({ 
      message: 'Inventario inicial creado',
      id_inventory,
      items: createdItems 
    });
  } catch (error) {
    console.error('Error al crear inventario:', error);
    res.status(500).json({ message: 'Error al crear inventario.' });
  }
});

// Obtener inventario del jugador por nickname
router.get('/inventory/:nickname', async (req, res) => {
  const { nickname } = req.params;

  try {
    const player = await Player.findOne({ where: { nickname } });

    if (!player) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const inventoryItems = await Inventory.findAll({
      where: { player_id: player.id_player },
      include: [{
        model: Item,
        attributes: ['id_item', 'item_name', 'item_description', 'item_type', 'value', 'rarity', 'item_image']
      }]
    });

    if (inventoryItems.length === 0) {
      return res.status(404).json({ message: 'El jugador no tiene ítems en su inventario.' });
    }

    const formattedInventory = inventoryItems.map(inv => ({
      id_item: inv.Item.id_item,
      item_name: inv.Item.item_name,
      item_description: inv.Item.item_description,
      item_type: inv.Item.item_type,
      value: inv.Item.value,
      rarity: inv.Item.rarity,
      item_image: inv.Item.item_image,
      quantity: inv.quantity
    }));

    res.json(formattedInventory);
  } catch (error) {
    console.error('Error al obtener el inventario:', error);
    res.status(500).json({ message: 'Error al obtener el inventario.' });
  }
});

// Agregar item al inventario
router.post('/addItem', async (req, res) => {
  const { player_id, item_id, quantity = 1 } = req.body;

  try {
    const [inventory, created] = await Inventory.findOrCreate({
      where: { player_id, id_item: item_id },
      defaults: { quantity }
    });

    if (!created) {
      await inventory.update({
        quantity: inventory.quantity + quantity
      });
    }

    res.status(200).json({ message: 'Ítem añadido al inventario.' });
  } catch (error) {
    console.error('Error al agregar el ítem al inventario:', error);
    res.status(500).json({ message: 'Error al agregar el ítem al inventario.' });
  }
});

// Eliminar item del inventario
router.delete('/removeItem', async (req, res) => {
  const { player_id, item_id, quantity } = req.body;

  try {
    const inventory = await Inventory.findOne({
      where: { player_id, id_item: item_id }
    });

    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ message: 'No hay suficientes unidades del ítem.' });
    }

    if (inventory.quantity === quantity) {
      await inventory.destroy();
    } else {
      await inventory.update({
        quantity: inventory.quantity - quantity
      });
    }

    res.status(200).json({ message: 'Ítem eliminado del inventario.' });
  } catch (error) {
    console.error('Error al eliminar el ítem:', error);
    res.status(500).json({ message: 'Error al eliminar el ítem.' });
  }
});

// Obtener información de un item específico
router.get('/item/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).send('No se encontró el ítem.');
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error al obtener el ítem:', error);
    res.status(500).send('Error al obtener el ítem.');
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

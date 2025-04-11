const Inventory = require('../models/Inventory');

const seedInventory = async () => {
  const inventoryItems = [
    {
      player_id: 1,
      id_item: 1, // Llave Roja
      quantity: 1
    },
    {
      player_id: 1,
      id_item: 2, // Poción de Vida
      quantity: 3
    },
    {
      player_id: 2,
      id_item: 3, // Poción de Maná
      quantity: 2
    },
    {
      player_id: 2,
      id_item: 5, // Llave Dorada
      quantity: 1
    },
    {
      player_id: 3,
      id_item: 6, // Llave Esqueleto
      quantity: 2
    },
    {
      player_id: 3,
      id_item: 2, // Poción de Vida
      quantity: 5
    }
  ];

  await Inventory.bulkCreate(inventoryItems, { ignoreDuplicates: true });
  console.log('Inventario insertado correctamente');
};

module.exports = seedInventory;

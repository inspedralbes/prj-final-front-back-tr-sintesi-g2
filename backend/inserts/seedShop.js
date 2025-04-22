const Shop = require('../models/Shop');

const seedShop = async () => {
  const skins = [
    {
      skin_name: 'John',
      description: 'Un skin ardiente con armadura incandescente.',
      price: 500,
      image_url: 'imagenes/shop/john/idle.jpg',
      is_available: true
    },
    {
      skin_name: 'test',
      description: 'Un skin de prueba.',
      price: 1000,
      image_url: 'imagenes/shop/test/idle.jpg',
      is_available: true
    }
  ];

  await Shop.bulkCreate(skins, { ignoreDuplicates: true });
  console.log('Skins insertadas correctamente');
};

module.exports = seedShop;

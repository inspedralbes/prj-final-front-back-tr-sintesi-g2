const Shop = require('../models/Shop');

const seedShop = async () => {
  const skins = [
    {
      skin_name: 'Guerrero de Fuego',
      description: 'Un skin ardiente con armadura incandescente.',
      price: 500,
      image_url: '/skins/guerrero-fuego.png',
      is_available: true
    },
    {
      skin_name: 'Sombra Nocturna',
      description: 'Ideal para moverse sigilosamente en la oscuridad.',
      price: 350,
      image_url: '/skins/sombra-nocturna.png',
      is_available: true
    },
    {
      skin_name: 'Caballero Dorado',
      description: 'Brilla en combate con esta armadura de oro puro.',
      price: 750,
      image_url: '/skins/caballero-dorado.png',
      is_available: false
    },
    {
      skin_name: 'Ninja Azul',
      description: 'Un skin ágil y veloz con estética oriental.',
      price: 400,
      image_url: '/skins/ninja-azul.png',
      is_available: true
    },
    {
      skin_name: 'Forajido del Desierto',
      description: 'Ropa polvorienta de un guerrero errante.',
      price: 300,
      image_url: '/skins/forajido-desierto.png',
      is_available: true
    }
  ];

  await Shop.bulkCreate(skins, { ignoreDuplicates: true });
  console.log('Skins insertadas correctamente');
};

module.exports = seedShop;

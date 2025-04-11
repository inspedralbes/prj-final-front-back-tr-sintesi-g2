  const Item = require('../models/Item');

  const seedItems = async () => {
    const items = [
      {
        item_name: 'Llave Roja',
        item_description: 'Una llave misteriosa de color rojo.',
        item_type: 'llave',
        value: 100,
        rarity: 'rare',
        item_image: 'backend\imagenes\llave-roja.png'
      },
      {
        item_name: 'Poción de Vida',
        item_description: 'Una poción que restaura la salud del jugador.',
        item_type: 'pocion',
        value: 50,
        rarity: 'common',
        item_image: 'backend\imagenes\pocionVida.png'
      },
      {
        item_name: 'Poción de Maná',
        item_description: 'Una poción que restaura el maná del jugador.',
        item_type: 'pocion',
        value: 50,
        rarity: 'common',
        item_image: 'backend\imagenes\pocionMana.png'
      },
      {
        item_name: 'Llave Morada',
        item_description: 'Una llave misteriosa de color morado.',
        item_type: 'llave',
        value: 150,
        rarity: 'rare',
        item_image: 'backend\imagenes\llave-morada.png'
      },
      {
        item_name: 'Llave Dorada',
        item_description: 'Una llave de oro que abre cofres especiales.',
        item_type: 'llave',
        value: 200,
        rarity: 'epic',
        item_image: 'backend\imagenes\llave-dorada.png'
      },
      {
        item_name: 'Llave Esqueleto',
        item_description: 'Una llave antigua con forma de esqueleto.',
        item_type: 'llave',
        value: 150,
        rarity: 'rare',
        item_image: 'backend\imagenes\llave-esqueleto.png'
      },
      {
        item_name: 'Llave Lobo',
        item_description: 'Una llave decorada con la forma de un lobo.',
        item_type: 'llave',
        value: 100,
        rarity: 'uncommon',
        item_image: 'backend\imagenes\llave-lobo.png'
      },
      {
        item_name: 'Llave Dragón',
        item_description: 'Una llave poderosa con la figura de un dragón.',
        item_type: 'llave',
        value: 300,
        rarity: 'epic',
        item_image: 'backend\imagenes\llave-dragon.png'
      }
    ];

    await Item.bulkCreate(items, { ignoreDuplicates: true }); // evita errores por duplicados
    console.log('Items insertados correctamente');
  };

  module.exports = seedItems;

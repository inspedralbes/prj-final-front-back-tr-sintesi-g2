// -------------------- CONSTANTES -------------------- //  

const mysql = require('mysql2/promise');
const createDB = require('./configDB');
const express = require('express');
const app = express();
const { createServer } = require('http');
const server = createServer(app);
require('dotenv').config({ path: './environment/.env' });
const port = process.env.PORT;
const cors = require('cors');  // Importa cors
// -------------------- CONSTANTES -------------------- //

/* Crear la base de datos a partir del archivo configDB.js */
// (async () => { 
//   await createDB();
//  })();

// CONEXIÓN A LA BASE DE DATOS
const dataConnection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true
};



async function connectDB() {
  try {
    const connection = await mysql.createConnection(dataConnection);
    console.log('Conexión a la base de datos exitosa.');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
}

app.use(cors());
app.use(express.json());

// -------------------- SERVIR IMÁGENES -------------------- //
app.use('/imagenes', express.static('imagenes'));  // Sirve imágenes desde la carpeta 'imagenes'

// -------------------- CARGAR IMÁGENES DESDE LA CARPETA -------------------- //
app.post('/cargarImagenes', async (req, res) => {
  const imagenesPath = path.join(__dirname, 'imagenes');  // Ruta a la carpeta 'imagenes'

  // Leer los nombres de las imágenes en la carpeta
  const imagenes = fs.readdirSync(imagenesPath);

  let connection;

  try {
    connection = await connectDB();

    // Iterar sobre cada imagen
    for (const imagen of imagenes) {
      // Suponemos que la imagen tiene el mismo nombre que el 'item_name'
      const itemName = imagen.split('.')[0]; // Obtener el nombre del ítem a partir de la imagen
      const imagePath = `/imagenes/${imagen}`; // URL relativa de la imagen

      // Buscar el item por su nombre
      const [items] = await connection.query('SELECT id FROM item WHERE item_name = ?', [itemName]);

      if (items.length > 0) {
        const itemId = items[0].id;

        // Insertar la ruta de la imagen en la tabla 'item_image'
        await connection.query(
          'INSERT INTO item_image (item_id, image_name, image_path) VALUES (?, ?, ?)',
          [itemId, imagen, imagePath]
        );
      } else {
        console.log(`No se encontró el ítem para la imagen: ${imagen}`);
      }
    }

    res.status(201).send('Imágenes cargadas con éxito.');
  } catch (error) {
    console.error('Error al cargar las imágenes:', error);
    res.status(500).send('Error al cargar las imágenes.');
  } finally {
    if (connection) {
      connection.end();
      console.log("Connection closed.");
    }
  }
});

// -------------------- Registre PLAYER  -------------------- //

// Registre usuaris MENTOR
app.post('/player', async (req, res) => {
  const { nickname } = req.body;

  // Validación de datos
  if (!nickname) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    // Conectar a la base de datos
    connection = await connectDB();

    // Ejecutar la consulta SQL
    const [rows] = await connection.query(
      `INSERT INTO PLAYER 
      (nickname) 
      VALUES (?)`,
      [nickname]
    );

    const message = { message: `Jugador insertado con éxito.` };
    res.status(201).send(JSON.stringify(message));
  } catch (error) {
    console.error('Error al insertar jugador:', error);
    res.status(500).send('Error al insertar jugador.');
  } finally {
    if (connection) {
      connection.end();
      console.log("Connection closed.");
    }
  }
});

// -------------------- Login PLAYER  -------------------- //

app.post('/loginPlayer', async (req, res) => {
  const { nickname } = req.body;
  if (!nickname) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM PLAYER WHERE nickname = ? ', [nickname]);
    console.log("Player: ", rows);

    if (rows.length == 0) {
      return res.status(404).send('Player no encontrado.');
    }

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).send('Error fetching player.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// --------------------ÍTEM -------------------- //

// -------------------- Obtener Inventario del Jugador -------------------- //
app.get('/inventario/:player_id', async (req, res) => {
  const { player_id } = req.params;
  
  let connection;
  
  try {
      connection = await connectDB();
      
      const [rows] = await connection.query(
          `SELECT 
              i.id_item, 
              i.item_name, 
              i.item_description, 
              i.item_type, 
              i.value, 
              i.rarity, 
              i.item_image, 
              pi.quantity
          FROM INVENTORY pi
          JOIN ITEM i ON pi.id_item = i.id_item
          WHERE pi.player_id = ?`,
          [player_id]
      );
      
      if (rows.length === 0) {
          return res.status(404).json({ message: 'El jugador no tiene ítems en su inventario.' });
      }

      res.json(rows);
      
  } catch (error) {
      console.error('Error al obtener el inventario:', error);
      res.status(500).json({ message: 'Error al obtener el inventario.' });
  } finally {
      if (connection) {
          connection.end();
      }
  }
});

// -------------------- Agregar Ítem al Inventario -------------------- //
app.post('/agregarItemInventario', async (req, res) => {
  const { player_id, item_id, quantity } = req.body;  // Ahora estamos tomando player_id y item_id de la solicitud.

  let connection;

  try {
      connection = await connectDB();

      // Comprobar si el jugador ya tiene el ítem en su inventario
      const [rows] = await connection.query(
          `SELECT quantity FROM INVENTORY WHERE player_id = ? AND id_item = ?`,
          [player_id, item_id]
      );

      if (rows.length > 0) {
          // Si ya tiene el ítem, actualizar la cantidad
          await connection.query(
              `UPDATE INVENTORY SET quantity = quantity + ? WHERE player_id = ? AND id_item = ?`,
              [quantity, player_id, item_id]
          );
      } else {
          // Si no tiene el ítem, insertarlo en su inventario
          await connection.query(
              `INSERT INTO INVENTORY (player_id, id_item, quantity) VALUES (?, ?, ?)`,
              [player_id, item_id, quantity]
          );
      }

      res.status(200).json({ message: 'Ítem añadido al inventario.' });

  } catch (error) {
      console.error('Error al agregar el ítem al inventario:', error);
      res.status(500).json({ message: 'Error al agregar el ítem al inventario.' });
  } finally {
      if (connection) {
          connection.end();
      }
  }
});


// -------------------- CARGAR IMÁGENES PARA UN ÍTEM -------------------- //

app.get('/inventario/:itemId', async (req, res) => {
  const { itemId } = req.params;

  let connection;

  try {
    connection = await connectDB();
    const [images] = await connection.query('SELECT image_name, image_path FROM item_image WHERE item_id = ?', [itemId]);

    if (images.length === 0) {
      return res.status(404).send('No se encontraron imágenes para este ítem.');
    }

    res.status(200).json(images);  // Devuelve las imágenes asociadas al ítem
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    res.status(500).send('Error al obtener las imágenes.');
  } finally {
    if (connection) {
      connection.end();
      console.log("Connection closed.");
    }
  }
});

// Obtener un ítem por ID
app.get('/item/:id', async (req, res) => {
  const { id } = req.params;
  
  let connection;
  
  try {
      connection = await connectDB();

      // Obtener el item por id
      const [rows] = await connection.query(
          `SELECT id_item, item_name, item_description, item_type, value, rarity, item_image
          FROM item WHERE id_item = ?`, 
          [id]
      );

      if (rows.length === 0) {
          return res.status(404).json({ message: 'Ítem no encontrado.' });
      }

      res.status(200).json(rows[0]);  // Devuelve el ítem encontrado
  } catch (error) {
      console.error('Error al obtener el ítem:', error);
      res.status(500).json({ message: 'Error al obtener el ítem.' });
  } finally {
      if (connection) {
          connection.end();
      }
  }
});



server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

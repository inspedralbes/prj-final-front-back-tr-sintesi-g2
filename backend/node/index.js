/* Crear la base de datos a partir del archivo configDB.js */
//(async () => { 
//  await createDB();
//})();



// -------------------- CONSTANTES -------------------- //  

const mysql = require('mysql2/promise');
const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './environment/.env' });

const app = express();
const server = createServer(app);
const port = process.env.PORT;

// -------------------- CONSTANTES -------------------- //

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

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

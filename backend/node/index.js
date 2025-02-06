// -------------------- CONSTANTES -------------------- //  

const mysql = require('mysql2/promise');
const createDB = require('./configDB');
const express = require('express');
const { createServer } = require('http');
const cors = require('cors')
const app = express();
const server = createServer(app);
require('dotenv').config({ path: './environment/.env' });
const port = process.env.PORT;

// -------------------- CONSTANTES -------------------- //

/* Crear la base de datos a partir del archivo configDB.js */
(async () => { 
  await createDB();
})();


// CONEXIÓN A LA BASE DE DATOS
// Hace una conexión a la base de datos usando los datos del archivo .env
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



//-------------------- Registre PLAYER  -------------------- //

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

//-------------------- Login PLAYER  -------------------- //

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



//-------------------- crear GAME -------------------- //

app.post('/newGame', async (req, res) => {
  const {
    nickname,
    game_name,
    game_status = 'active',
    total_progress = 0.00,
    level_reached = 1,
    time_played = 0,
    position_x = 0,
    position_y = 0,
    health = 100,
    coins = 0
  } = req.body;

  if (!nickname || !game_name) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();

    // Buscar ID del jugador
    const [playerRows] = await connection.query(
      'SELECT id_player FROM PLAYER WHERE nickname = ?', [nickname]
    );

    if (playerRows.length === 0) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const playerId = playerRows[0].id_player;

    // Verificar si el jugador ya tiene una partida
    const [gameRows] = await connection.query(
      'SELECT id_game FROM GAME WHERE id_player = ?', [playerId]
    );

    if (gameRows.length > 0) {
      return res.status(403).send('El jugador ya tiene una partida activa.');
    }

    // Crear un inventario si no existe
    const [inventoryRows] = await connection.query(
      'SELECT id_inventory FROM INVENTORY WHERE id_inventory IN (SELECT id_inventory FROM GAME WHERE id_player = ?)', 
      [playerId]
    );

    let inventoryId;
    if (inventoryRows.length === 0) {
      const [inventoryResult] = await connection.query(
        'INSERT INTO INVENTORY (id_item, quantity) VALUES (?, ?)', [1, 1]
      );
      inventoryId = inventoryResult.insertId;
    } else {
      inventoryId = inventoryRows[0].id_inventory;
    }

    // Crear la única partida del jugador
    const [gameResult] = await connection.query(
      `INSERT INTO GAME 
      (id_player, id_inventory, game_name, game_status, total_progress, level_reached, time_played, position_x, position_y, health, coins) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [playerId, inventoryId, game_name, game_status, total_progress, level_reached, time_played, position_x, position_y, health, coins]
    );

    res.status(201).json({
      message: 'Juego creado con éxito',
      gameId: gameResult.insertId,
      position: { x: position_x, y: position_y },
      health,
      coins
    });

  } catch (error) {
    console.error('Error al crear el juego:', error);
    res.status(500).send('Error al crear el juego.');
  } finally {
    if (connection) connection.end();
  }
});




  server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
// -------------------- CONSTANTES -------------------- //  

const mysql = require('mysql2/promise');
const createDB = require('./data/config/configDB');
const express = require('express');
const app = express();
const { createServer } = require('http');
const server = createServer(app);
require('dotenv').config({ path: './environment/.env' });
const port = process.env.PORT;
const cors = require('cors');  // Importa cors
// -------------------- CONSTANTES -------------------- //

/* Crear la base de datos a partir del archivo configDB.js */
 (async () => { 
   await createDB();
  })();

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



//-------------------- crear GAME -------------------- //

app.post('/newGame', async (req, res) => {
  const {
    nickname,
    game_name,
    game_status = 'active',
    total_progress = 0.00,
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
        'INSERT INTO INVENTORY ( player_id, id_item, quantity) VALUES (?, ?, ?)', [playerId, 1, 1]
      );
      inventoryId = inventoryResult.insertId;
    } else {
      inventoryId = inventoryRows[0].id_inventory;
    }

    // Crear la única partida del jugador
    const [gameResult] = await connection.query(
      `INSERT INTO GAME 
      (id_player, id_inventory, game_name, game_status, total_progress, time_played, position_x, position_y, health, coins) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [playerId, inventoryId, game_name, game_status, total_progress, time_played, position_x, position_y, health, coins]
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


//-------------------- borrar GAME -------------------- //

app.delete('/deleteGame/:nickname', async (req, res) => {
  const { nickname } = req.params;

  if (!nickname) {
    return res.status(400).send('ID de juego no proporcionado.');
  }

  let connection;
  try {
    connection = await connectDB();

    // Obtener el id_player a partir del nickname
    const [playerRows] = await connection.query('SELECT id_player FROM PLAYER WHERE nickname = ?', [nickname]);
    if (playerRows.length === 0) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const id_player = playerRows[0].id_player;

    // Verificar si el juego existe
    const [gameRows] = await connection.query('SELECT * FROM GAME WHERE id_player = ?', [id_player]);
    if (gameRows.length === 0) {
      return res.status(404).send('Juego no encontrado.');
    }

    // Eliminar el juego (las restricciones ON DELETE CASCADE se encargan de las referencias)
    await connection.query('DELETE FROM GAME WHERE id_player = ?', [id_player]);

    res.status(200).json({ message: 'Juego eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el juego:', error);
    res.status(500).send('Error al eliminar el juego.');
  } finally {
    if (connection) connection.end();
  }
});


//-------------------- actualizar INVENTORY -------------------- //

app.put('/updateInventory/:nickname', async (req, res) => {
  const { nickname } = req.params;
  const { id_item, quantity } = req.body;

  if (!id_item || quantity === undefined) {
    return res.status(400).send('Datos incompletos. Se requiere id_item y quantity.');
  }

  let connection;

  try {
    connection = await connectDB();

    // Obtener el id_player a partir del nickname
    const [playerRows] = await connection.query('SELECT id_player FROM PLAYER WHERE nickname = ?', [nickname]);
    if (playerRows.length === 0) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const id_player = playerRows[0].id_player;

    // Verificar si el jugador tiene un inventario
    const [inventoryRows] = await connection.query('SELECT id_inventory FROM INVENTORY WHERE id_item = ? AND id_inventory IN (SELECT id_inventory FROM GAME WHERE id_player = ?)', [id_item, id_player]);
    
    if (inventoryRows.length === 0) {
      return res.status(404).send('Inventario no encontrado para este jugador.');
    }

    // Actualizar la cantidad del ítem en el inventario
    const [inventoryUpdateResult] = await connection.query(
      'UPDATE INVENTORY SET quantity = ? WHERE id_inventory = ? AND id_item = ?',
      [quantity, inventoryRows[0].id_inventory, id_item]
    );

    if (inventoryUpdateResult.affectedRows === 0) {
      return res.status(400).send('No se pudo actualizar la cantidad del ítem.');
    }

    res.status(200).json({
      message: 'Inventario actualizado con éxito',
    });
  } catch (error) {
    console.error('Error al actualizar el inventario:', error);
    res.status(500).send('Error al actualizar el inventario.');
  } finally {
    if (connection) connection.end();
  }
});




//-------------------- actualizar GAME -------------------- //
app.put('/updateGame/:nickname', async (req, res) => {
  const { nickname } = req.params;
  const {
    game_name,
    game_status,
    total_progress,
    time_played,
    position_x,
    position_y,
    health,
    coins
  } = req.body;

  if (!game_name && !game_status && total_progress === undefined && time_played === undefined &&
      position_x === undefined && position_y === undefined && health === undefined && coins === undefined) {
    return res.status(400).send('No se proporcionaron datos para actualizar.');
  }

  let connection;

  try {
    connection = await connectDB();

    // Obtener el id_player a partir del nickname
    const [playerRows] = await connection.query('SELECT id_player FROM PLAYER WHERE nickname = ?', [nickname]);
    if (playerRows.length === 0) {
      return res.status(404).send('Jugador no encontrado.');
    }

    const id_player = playerRows[0].id_player;

    // Buscar el juego asociado al id_player
    const [gameRows] = await connection.query('SELECT * FROM GAME WHERE id_player = ?', [id_player]);
    if (gameRows.length === 0) {
      return res.status(404).send('Juego no encontrado para este jugador.');
    }

    const updateFields = [];
    const updateValues = [];

    // Construir los campos que se deben actualizar
    if (game_name) {
      updateFields.push('game_name = ?');
      updateValues.push(game_name);
    }
    if (game_status) {
      updateFields.push('game_status = ?');
      updateValues.push(game_status);
    }
    if (total_progress !== undefined) {
      updateFields.push('total_progress = ?');
      updateValues.push(total_progress);
    }
    if (time_played !== undefined) {
      updateFields.push('time_played = ?');
      updateValues.push(time_played);
    }
    if (position_x !== undefined) {
      updateFields.push('position_x = ?');
      updateValues.push(position_x);
    }
    if (position_y !== undefined) {
      updateFields.push('position_y = ?');
      updateValues.push(position_y);
    }
    if (health !== undefined) {
      updateFields.push('health = ?');
      updateValues.push(health);
    }
    if (coins !== undefined) {
      updateFields.push('coins = ?');
      updateValues.push(coins);
    }

    if (updateFields.length === 0) {
      return res.status(400).send('No hay campos válidos para actualizar.');
    }

    // Agregar el ID del jugador al final de los valores para la cláusula WHERE
    updateValues.push(id_player);

    // Actualizar la tabla GAME
    await connection.query(
      `UPDATE GAME SET ${updateFields.join(', ')} WHERE id_player = ?`,
      updateValues
    );

    res.status(200).json({
      message: `Juego del jugador ${nickname} actualizado con éxito`,
    });

  } catch (error) {
    console.error('Error al actualizar el juego:', error);
    res.status(500).send('Error al actualizar el juego.');
  } finally {
    if (connection) connection.end();
  }
});


//-------------------- cargar GAME -------------------- //

app.get('/loadGame/:nickname', async (req, res) => {
  const { nickname } = req.params;

  if (!nickname) {
    return res.status(400).send('Nickname no proporcionado.');
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

    // Buscar la partida del jugador
    const [gameRows] = await connection.query(
      'SELECT * FROM GAME WHERE id_player = ?', [playerId]
    );

    if (gameRows.length === 0) {
      return res.status(404).send('No hay partida guardada para este jugador.');
    }

    const gameData = gameRows[0];

    // Obtener el inventario del jugador
    const [inventoryRows] = await connection.query(
      'SELECT id_item, quantity FROM INVENTORY WHERE id_inventory = ?', [gameData.id_inventory]
    );

    console.log("partida cargada con eixto", gameData);

    res.status(200).json({
      message: 'Partida cargada con éxito',
      game: {
        gameId: gameData.id_game,
        gameName: gameData.game_name,
        gameStatus: gameData.game_status,
        totalProgress: gameData.total_progress,
        timePlayed: gameData.time_played,
        position_x: gameData.position_x,
        position_y: gameData.position_y,
        health: gameData.health,
        coins: gameData.coins,
        inventory: inventoryRows,
      },
    });
  } catch (error) {
    console.error('Error al cargar la partida:', error);
    res.status(500).send('Error al cargar la partida.');
  } finally {
    if (connection) connection.end();
  }
});



app.get('/lastGame/:nickname', async (req, res) => {
  const { nickname } = req.params;

  if (!nickname) {
    return res.status(400).send('ID de jugador no proporcionado.');
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

    // Obtener la última partida del jugador
    const [gameRows] = await connection.query(
      'SELECT * FROM GAME WHERE id_player = ? ORDER BY last_save_date DESC LIMIT 1',
      [playerId]
    );

    if (gameRows.length === 0) {
      return res.status(404).send('No se encontró ninguna partida para este jugador.');
    }

    res.status(200).json(gameRows[0]);
  } catch (error) {
    console.error('Error al obtener la última partida:', error);
    res.status(500).send('Error al obtener la última partida.');
  } finally {
    if (connection) connection.end();
  }
});


// --------------------ÍTEM -------------------- //

// -------------------- Obtener Inventario del Jugador -------------------- //
app.get('/inventario/:nickname', async (req, res) => {
  const { nickname } = req.params;
  
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
          [playerId]
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
  const { player_id, item_id, quantity } = req.body;  // Ahora estamos tomando player_id y id_item  de la solicitud.

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
    const [images] = await connection.query('SELECT image_name, image_path FROM item_image WHERE id_item = ?', [itemId]);

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

app.delete('/eliminarItemInventario', async (req, res) => {
  const { player_id, item_id, quantity } = req.body;

  let connection;
  try {
    connection = await connectDB();

    const [result] = await connection.query(
      `UPDATE INVENTORY SET quantity = quantity - ? 
       WHERE player_id = ? AND id_item  = ? AND quantity >= ?`,
      [quantity, player_id, item_id, quantity]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'No tienes suficientes pociones.' });
    }

    res.status(200).json({ message: 'Poción eliminada del inventario.' });
  } catch (error) {
    console.error('Error al eliminar el ítem:', error);
    res.status(500).json({ message: 'Error al eliminar el ítem.' });
  } finally {
    if (connection) connection.end();
  }
});


server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

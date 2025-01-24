// -------------------- CONSTANTES -------------------- //  

const mysql = require('mysql2/promise');
const createDB = require('./configDB');
const express = require('express');
const app = express();
const { createServer } = require('http');
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


  server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
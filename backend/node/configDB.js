const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config({ path: './environment/.env' });

const sqlFileCrateDB = path.join(__dirname, '.', 'data', 'createDB.sql');
const fileCreateSQL = fs.readFileSync(sqlFileCrateDB, 'utf8');
const sqlFileInsertDB = path.join(__dirname, '.', 'data', 'insertDataDB.sql');
const fileInsertSQL = fs.readFileSync(sqlFileInsertDB, 'utf8');

async function createDB() {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });

        connection.connect(async (err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                reject(err);
                return;
            }
            console.log('Connected to MySQL.');

            try {
                const [result] = await connection.promise().query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
                
                if (result.length === 0) {
                    console.log('The database does not exist. Creating the database...');
                    await connection.promise().query(`CREATE DATABASE ${process.env.DB_NAME}`);
                    console.log('Database created.');
                    await createTables(connection);
                    await insertDataTables(connection);
                } else {
                    console.log('The database exists. Restart database...');
                    await connection.promise().query(`DROP DATABASE ${process.env.DB_NAME}`);
                    console.log('Database deleted.');
                    await connection.promise().query(`CREATE DATABASE ${process.env.DB_NAME}`);
                    console.log('Database created.');
                    await createTables(connection);
                    await insertDataTables(connection);
                }
                
                connection.end();
                resolve();
            } catch (error) {
                connection.end();
                reject(error);
            }
        });
    });
}

async function createTables(connection) {
    await connection.promise().query(`USE ${process.env.DB_NAME}`);
    console.log('Database selected.');

    const sqlStatementsCreate = fileCreateSQL.split(';')
        .map(statement => statement.trim())
        .filter(statement => statement);

    for (const tableSQL of sqlStatementsCreate) {
        await connection.promise().query(tableSQL);
        console.log('Table created.');
    }
}

async function insertDataTables(connection) {
    await connection.promise().query(`USE ${process.env.DB_NAME}`);
    console.log('Database selected for data insertion.');

    const insertStatements = fileInsertSQL.split(';')
        .map(statement => statement.trim())
        .filter(statement => statement);

    for (const insertSQL of insertStatements) {
        await connection.promise().query(insertSQL);
        console.log('Data inserted.');
    }
}

module.exports = createDB;
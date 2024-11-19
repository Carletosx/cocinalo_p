const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'cualquiera1?',
    database: process.env.DB_NAME || 'planificacionrecetasdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión
pool.getConnection()
    .then(connection => {
        console.log('Conectado exitosamente a la base de datos MySQL');
        connection.release();
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    });

module.exports = pool; 
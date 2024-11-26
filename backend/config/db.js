const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones usando variables de RDS
const pool = mysql.createPool({
    host: process.env.RDS_HOSTNAME || process.env.DB_HOST ,
    user: process.env.RDS_USERNAME || process.env.DB_USER ,
    password: process.env.RDS_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.RDS_DB_NAME || process.env.DB_NAME ,
    port: process.env.RDS_PORT || process.env.DB_PORT ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión con mejor manejo de errores
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado exitosamente a la base de datos MySQL');
        connection.release();
    } catch (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        // En producción, podrías querer reintentar la conexión en lugar de terminar el proceso
        if (process.env.NODE_ENV === 'production') {
            console.log('Reintentando conexión en 5 segundos...');
            setTimeout(testConnection, 5000);
        } else {
            process.exit(1);
        }
    }
};

testConnection();

module.exports = pool; 
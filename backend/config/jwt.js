const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_temporal';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('ADVERTENCIA: JWT_SECRET no está definido en las variables de entorno');
    process.exit(1);
}

module.exports = {
    JWT_SECRET,
    generateToken: (userId) => {
        return jwt.sign(
            { userId }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );
    }
}; 
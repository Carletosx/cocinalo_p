const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
    try {
        console.log('Headers recibidos:', req.headers);
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            console.log('No se encontró header de autorización');
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token extraído:', token ? `${token.substring(0, 20)}...` : 'null');
        
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token decodificado:', decoded);
        
        req.user = { id: decoded.userId };
        console.log('Usuario autenticado:', req.user);
        
        next();
    } catch (error) {
        console.error('Error detallado de autenticación:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};

module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

module.exports = authMiddleware;
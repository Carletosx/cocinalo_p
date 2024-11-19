const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/AuthMiddleware');
const authRoutes = require('./authRoutes');
const calendarRoutes = require('./calendarRoutes');
const recipeRoutes = require('./recipeRoutes');

// Rutas públicas
router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);

// Rutas protegidas
router.use('/calendar', verifyToken, calendarRoutes);

// Manejo de errores
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});
router.use('/calendar', calendarRoutes);
module.exports = router; 
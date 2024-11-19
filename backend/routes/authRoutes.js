const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/authValidation');

// Agregar validación de middleware
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

// Agregar manejo de errores específico para auth
router.use((err, req, res, next) => {
    if (err.name === 'AuthenticationError') {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
    next(err);
});

module.exports = router;
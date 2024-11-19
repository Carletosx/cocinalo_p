// Middleware de validación para registro
const validateRegistration = (req, res, next) => {
    const { nombre, apellido, correo, password } = req.body;

    if (!nombre?.trim() || !apellido?.trim() || !correo?.trim() || !password?.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({
            success: false,
            message: 'Formato de correo inválido'
        });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'La contraseña debe tener al menos 6 caracteres'
        });
    }

    next();
};

// Middleware de validación para login
const validateLogin = (req, res, next) => {
    const { correo, password } = req.body;

    if (!correo?.trim() || !password?.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Correo y contraseña son requeridos'
        });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({
            success: false,
            message: 'Formato de correo inválido'
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
}; 
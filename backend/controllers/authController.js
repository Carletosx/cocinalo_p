const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../config/jwt');

const authController = {
    registerUser: async (req, res) => {
        try {
            console.log('Datos recibidos:', req.body);
            const { nombre, apellido, correo, password } = req.body;

            // Validaciones básicas
            if (!nombre?.trim() || !apellido?.trim() || !correo?.trim() || !password?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            // Crear usuario
            const newUser = await User.create({
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                correo: correo.trim(),
                password: password
            });

            // Generar token
            const token = generateToken(newUser.id);

            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: newUser.id,
                        nombre: newUser.nombre,
                        apellido: newUser.apellido,
                        correo: newUser.correo
                    },
                    token
                },
                message: 'Usuario registrado exitosamente'
            });

        } catch (error) {
            console.error('Error en registro:', error);
            if (error.message === 'El correo ya está registrado') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al registrar usuario'
            });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { correo, password } = req.body;

            if (!correo?.trim() || !password?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Correo y contraseña son requeridos'
                });
            }

            const user = await User.findByEmail(correo);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            const token = generateToken(user.id);

            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        correo: user.correo
                    },
                    token
                },
                message: 'Login exitoso'
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error al iniciar sesión'
            });
        }
    }
};

module.exports = authController; 
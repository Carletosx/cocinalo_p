const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    findByEmail: async (correo) => {
        try {
            const [rows] = await db.execute(
                'SELECT id, nombre, apellido, correo, password FROM users WHERE correo = ?',
                [correo.toLowerCase()]
            );
            return rows[0];
        } catch (error) {
            console.error('Error en findByEmail:', error);
            throw error;
        }
    },

    create: async (userData) => {
        try {
            // Verificar si el usuario ya existe
            const existingUser = await User.findByEmail(userData.correo);
            if (existingUser) {
                throw new Error('El correo ya está registrado');
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Insertar usuario
            const [result] = await db.execute(
                'INSERT INTO users (nombre, apellido, correo, password) VALUES (?, ?, ?, ?)',
                [
                    userData.nombre,
                    userData.apellido,
                    userData.correo.toLowerCase(),
                    hashedPassword
                ]
            );

            return {
                id: result.insertId,
                nombre: userData.nombre,
                apellido: userData.apellido,
                correo: userData.correo.toLowerCase()
            };
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }
};

module.exports = User; 
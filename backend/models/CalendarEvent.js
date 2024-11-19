const db = require('../config/db');

const CalendarEvent = {
    getByUserId: async (userId) => {
        try {
            console.log('Buscando eventos para usuario:', userId);
            const [rows] = await db.execute(
                'SELECT * FROM calendar_events WHERE user_id = ? ORDER BY time_from ASC',
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('Error en getByUserId:', error);
            throw error;
        }
    },

    create: async (userId, eventData) => {
        try {
            console.log('Creando evento para usuario:', userId);
            const { title, day, month, year, timeFrom, timeTo } = eventData;
            
            const [result] = await db.execute(
                `INSERT INTO calendar_events 
                (user_id, title, day, month, year, time_from, time_to) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, title, day, month, year, timeFrom, timeTo]
            );

            return {
                id: result.insertId,
                user_id: userId,
                title,
                day,
                month,
                year,
                timeFrom,
                timeTo
            };
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    },

    delete: async (eventId, userId) => {
        try {
            console.log('Eliminando evento:', { eventId, userId });
            const [result] = await db.execute(
                'DELETE FROM calendar_events WHERE id = ? AND user_id = ?',
                [eventId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }
};

module.exports = CalendarEvent; 
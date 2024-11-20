const db = require('../config/db');

const CalendarEvent = {
    getByUserId: async (userId) => {
        try {
            console.log('Buscando eventos para usuario:', userId);
            const [rows] = await db.execute(`
                SELECT 
                    id,
                    user_id,
                    title,
                    day,
                    month,
                    year,
                    time_from as timeFrom,
                    time_to as timeTo,
                    created_at as createdAt
                FROM calendar_events 
                WHERE user_id = ? 
                ORDER BY year, month, day, time_from ASC`,
                [userId]
            );

            // Formatear los datos para el frontend
            return rows.map(event => ({
                id: event.id,
                title: event.title,
                day: parseInt(event.day),
                month: parseInt(event.month),
                year: parseInt(event.year),
                timeFrom: event.timeFrom,
                timeTo: event.timeTo
            }));
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
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
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
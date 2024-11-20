const db = require('../config/db');

const CalendarEvent = {
    getByUserId: async (userId) => {
        try {
            console.log('Buscando eventos para usuario:', userId);
            const [rows] = await db.execute(`
                SELECT 
                    ce.id,
                    ce.user_id,
                    ce.title,
                    ce.day,
                    ce.month,
                    ce.year,
                    ce.time_from as timeFrom,
                    ce.time_to as timeTo,
                    ce.recipe_id as recipeId,
                    ce.created_at as createdAt
                FROM calendar_events ce
                WHERE ce.user_id = ? 
                ORDER BY ce.year, ce.month, ce.day, ce.time_from ASC`,
                [userId]
            );

            return rows.map(event => ({
                id: event.id,
                title: event.title,
                day: parseInt(event.day),
                month: parseInt(event.month),
                year: parseInt(event.year),
                timeFrom: event.timeFrom,
                timeTo: event.timeTo,
                recipeId: event.recipeId
            }));
        } catch (error) {
            console.error('Error en getByUserId:', error);
            throw error;
        }
    },

    create: async (userId, eventData) => {
        try {
            const { title, day, month, year, timeFrom, timeTo, recipeId } = eventData;

            // Formatear las horas para asegurar formato HH:mm
            const formatTime = (time) => {
                return time.split(':').slice(0, 2).join(':');
            };

            const formattedTimeFrom = formatTime(timeFrom);
            const formattedTimeTo = formatTime(timeTo);

            const [result] = await db.execute(
                `INSERT INTO calendar_events 
                (user_id, title, day, month, year, time_from, time_to, recipe_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId, 
                    title, 
                    parseInt(day), 
                    parseInt(month), 
                    parseInt(year), 
                    formattedTimeFrom,
                    formattedTimeTo, 
                    recipeId || null
                ]
            );

            return {
                id: result.insertId,
                userId,
                title,
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                timeFrom: formattedTimeFrom,
                timeTo: formattedTimeTo,
                recipeId: recipeId || null
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
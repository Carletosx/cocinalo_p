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
                    ce.time_from,
                    ce.time_to,
                    ce.recipe_id,
                    ce.created_at,
                    IF(COALESCE(es.is_completed, 0) = 1, true, false) as isCompleted
                FROM calendar_events ce
                LEFT JOIN event_status es ON ce.id = es.event_id
                WHERE ce.user_id = ?`,
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
            const { title, day, month, year, timeFrom, timeTo, recipeId } = eventData;

            if (!title || !day || !month || !year || !timeFrom || !timeTo) {
                throw new Error('Faltan campos requeridos');
            }

            const validatedData = {
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year)
            };

            const formatTime = (time) => time.split(':').slice(0, 2).join(':');

            const [result] = await db.execute(
                `INSERT INTO calendar_events 
                (user_id, title, day, month, year, time_from, time_to, recipe_id) 
                VALUES (?, ?, ?, ?, ?, STR_TO_DATE(?, '%H:%i'), STR_TO_DATE(?, '%H:%i'), ?)`,
                [
                    userId, 
                    title, 
                    validatedData.day, 
                    validatedData.month, 
                    validatedData.year, 
                    formatTime(timeFrom), 
                    formatTime(timeTo), 
                    recipeId || null
                ]
            );

            return {
                id: result.insertId,
                userId,
                title,
                ...validatedData,
                timeFrom: formatTime(timeFrom),
                timeTo: formatTime(timeTo),
                recipeId
            };
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    },

    delete: async (eventId, userId) => {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Eliminar registros de estado (completado)
            await connection.execute(
                'DELETE FROM event_status WHERE event_id = ?',
                [eventId]
            );

            // 2. Eliminar registros de ingredientes si existen
            await connection.execute(
                'DELETE FROM ingredient_checklist WHERE event_id = ?',
                [eventId]
            );

            // 3. Finalmente eliminar el evento
            const [result] = await connection.execute(
                'DELETE FROM calendar_events WHERE id = ? AND user_id = ?',
                [eventId, userId]
            );

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            console.error('Error en delete:', error);
            throw error;
        } finally {
            connection.release();
        }
    },

    getById: async (eventId, userId) => {
        try {
            console.log('Buscando evento:', { eventId, userId });

            const [rows] = await db.execute(`
                SELECT 
                    ce.id,
                    ce.user_id as userId,
                    ce.title,
                    ce.day,
                    ce.month,
                    ce.year,
                    TIME_FORMAT(ce.time_from, '%H:%i') as timeFrom,
                    TIME_FORMAT(ce.time_to, '%H:%i') as timeTo,
                    ce.recipe_id as recipeId,
                    ce.created_at as createdAt,
                    r.nombre_receta as recipeName,
                    r.ingredientes as ingredients,
                    r.instrucciones as instructions,
                    r.tiempo_preparacion as prepTime
                FROM calendar_events ce
                LEFT JOIN recetas r ON ce.recipe_id = r.id_receta
                WHERE ce.id = ? AND ce.user_id = ?
                LIMIT 1`,
                [parseInt(eventId), parseInt(userId)]
            );

            if (rows.length === 0) return null;

            // Procesar los ingredientes e instrucciones
            const event = rows[0];
            if (event.ingredients) {
                event.ingredients = event.ingredients.split(',').map(i => i.trim());
            } else {
                event.ingredients = [];
            }

            if (event.instructions) {
                event.instructions = event.instructions
                    .split('.')
                    .map(i => i.trim())
                    .filter(i => i.length > 0);
            } else {
                event.instructions = [];
            }

            console.log('Evento procesado:', event);
            return event;
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    },

    update: async (eventId, userId, eventData) => {
        try {
            const { title, day, month, year, timeFrom, timeTo, recipeId } = eventData;
            
            const [result] = await db.execute(`
                UPDATE calendar_events 
                SET 
                    title = ?,
                    day = ?,
                    month = ?,
                    year = ?,
                    time_from = TIME_FORMAT(?, '%H:%i'),
                    time_to = TIME_FORMAT(?, '%H:%i'),
                    recipe_id = ?
                WHERE id = ? AND user_id = ?`,
                [
                    title,
                    parseInt(day),
                    parseInt(month),
                    parseInt(year),
                    timeFrom,
                    timeTo,
                    recipeId || null,
                    parseInt(eventId),
                    parseInt(userId)
                ]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            return {
                id: parseInt(eventId),
                userId: parseInt(userId),
                title,
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                timeFrom,
                timeTo,
                recipeId: recipeId || null
            };
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    },

    markAsCompleted: async (eventId, userId) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insertar o actualizar el estado de completado
            await connection.execute(
                `INSERT INTO event_status (event_id, user_id, is_completed) 
                 VALUES (?, ?, true)
                 ON DUPLICATE KEY UPDATE is_completed = true`,
                [eventId, userId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getEventStatus: async (eventId, userId) => {
        try {
            const [rows] = await db.execute(
                'SELECT is_completed, completed_at FROM event_status WHERE event_id = ? AND user_id = ?',
                [eventId, userId]
            );
            return rows[0] || { is_completed: false, completed_at: null };
        } catch (error) {
            console.error('Error en getEventStatus:', error);
            throw error;
        }
    }
};

module.exports = CalendarEvent; 
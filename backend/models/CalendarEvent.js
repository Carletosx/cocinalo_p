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
                    TIME_FORMAT(ce.time_from, '%H:%i') as timeFrom,
                    TIME_FORMAT(ce.time_to, '%H:%i') as timeTo,
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
            const { 
                title, 
                day, 
                month, 
                year, 
                timeFrom, 
                timeTo,
                ingredients,
                instructions 
            } = eventData;

            // Convertir arrays a strings si es necesario
            const ingredientsStr = Array.isArray(ingredients) ? ingredients.join(', ') : ingredients;
            const instructionsStr = Array.isArray(instructions) ? instructions.join('. ') : instructions;

            const [result] = await db.execute(
                `INSERT INTO calendar_events 
                (user_id, title, day, month, year, time_from, time_to, ingredients, instructions) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, title, day, month, year, timeFrom, timeTo, ingredientsStr, instructionsStr]
            );

            return {
                id: result.insertId,
                userId,
                title,
                day,
                month,
                year,
                timeFrom,
                timeTo,
                ingredients: ingredients,
                instructions: instructions
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
            const [rows] = await db.execute(`
                SELECT 
                    ce.*,
                    COALESCE(es.is_completed, false) as isCompleted
                FROM calendar_events ce
                LEFT JOIN event_status es ON ce.id = es.event_id
                WHERE ce.id = ? AND ce.user_id = ?`,
                [eventId, userId]
            );

            if (rows.length === 0) {
                return null;
            }

            const event = rows[0];

            // Procesar ingredientes e instrucciones
            const ingredients = event.ingredients ? 
                (typeof event.ingredients === 'string' ? 
                    event.ingredients.split(',').map(i => i.trim()) : 
                    event.ingredients
                ) : [];

            const instructions = event.instructions ? 
                (typeof event.instructions === 'string' ? 
                    event.instructions.split('.').filter(i => i.trim()).map(i => i.trim()) : 
                    event.instructions
                ) : [];

            return {
                id: event.id,
                userId: event.user_id,
                title: event.title,
                day: event.day,
                month: event.month,
                year: event.year,
                timeFrom: event.time_from,
                timeTo: event.time_to,
                recipeId: event.recipe_id,
                createdAt: event.created_at,
                recipeName: event.recipe_name,
                ingredients: ingredients,
                instructions: instructions,
                prepTime: event.prep_time,
                isCompleted: Boolean(event.isCompleted)
            };
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    },

    update: async (eventId, userId, eventData) => {
        try {
            const { 
                title, 
                day, 
                month, 
                year, 
                timeFrom, 
                timeTo,
                ingredients,
                instructions 
            } = eventData;

            await db.execute(
                `UPDATE calendar_events 
                SET title = ?, day = ?, month = ?, year = ?, 
                    time_from = ?, time_to = ?, 
                    ingredients = ?, instructions = ?
                WHERE id = ? AND user_id = ?`,
                [title, day, month, year, timeFrom, timeTo, ingredients, instructions, eventId, userId]
            );

            return {
                id: eventId,
                userId,
                title,
                day,
                month,
                year,
                timeFrom,
                timeTo,
                ingredients,
                instructions
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
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
                    DATE_FORMAT(ce.time_from, '%H:%i') as timeFrom,
                    DATE_FORMAT(ce.time_to, '%H:%i') as timeTo,
                    ce.recipe_id as recipeId,
                    ce.created_at as createdAt
                FROM calendar_events ce
                WHERE ce.user_id = ? 
                ORDER BY ce.year, ce.month, ce.day, ce.time_from ASC`,
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
        try {
            // Primero verificamos si ya existe un registro
            const [existing] = await db.execute(
                'SELECT * FROM event_status WHERE event_id = ? AND user_id = ?',
                [eventId, userId]
            );

            if (existing.length === 0) {
                // Si no existe, creamos uno nuevo
                await db.execute(
                    `INSERT INTO event_status (event_id, user_id, is_completed, completed_at) 
                     VALUES (?, ?, TRUE, CURRENT_TIMESTAMP)`,
                    [eventId, userId]
                );
            } else {
                // Si existe, actualizamos
                await db.execute(
                    `UPDATE event_status 
                     SET is_completed = TRUE, completed_at = CURRENT_TIMESTAMP 
                     WHERE event_id = ? AND user_id = ?`,
                    [eventId, userId]
                );
            }

            return true;
        } catch (error) {
            console.error('Error en markAsCompleted:', error);
            throw error;
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
    },

    updateIngredientChecklist: async (eventId, userId, ingredients) => {
        try {
            // Primero eliminamos los registros existentes
            await db.execute(
                'DELETE FROM ingredient_checklist WHERE event_id = ? AND user_id = ?',
                [eventId, userId]
            );

            // Luego insertamos los nuevos estados
            for (const [ingredient, isChecked] of Object.entries(ingredients)) {
                await db.execute(
                    `INSERT INTO ingredient_checklist 
                     (event_id, user_id, ingredient_name, is_checked) 
                     VALUES (?, ?, ?, ?)`,
                    [eventId, userId, ingredient, isChecked]
                );
            }

            return true;
        } catch (error) {
            console.error('Error en updateIngredientChecklist:', error);
            throw error;
        }
    },

    getIngredientChecklist: async (eventId, userId) => {
        try {
            const [rows] = await db.execute(
                'SELECT ingredient_name, is_checked FROM ingredient_checklist WHERE event_id = ? AND user_id = ?',
                [eventId, userId]
            );

            return rows.reduce((acc, row) => {
                acc[row.ingredient_name] = row.is_checked;
                return acc;
            }, {});
        } catch (error) {
            console.error('Error en getIngredientChecklist:', error);
            throw error;
        }
    }
};

module.exports = CalendarEvent; 
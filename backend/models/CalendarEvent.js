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

            // Función para limpiar datos
            const cleanData = (data) => {
                if (!data) return [];
                
                try {
                    // Si es un string, intentar parsearlo
                    if (typeof data === 'string') {
                        // Primero, eliminar todos los caracteres de escape extras
                        const cleanString = data.replace(/\\+"/g, '"')
                                              .replace(/\\\\/g, '')
                                              .replace(/\[\[+/g, '[')
                                              .replace(/\]\]+/g, ']')
                                              .replace(/^"|"$/g, '');
                        
                        // Intentar parsear el string limpio
                        const parsed = JSON.parse(cleanString);
                        
                        // Si es un array, limpiar cada elemento
                        if (Array.isArray(parsed)) {
                            return parsed.map(item => {
                                if (typeof item === 'string') {
                                    return item.replace(/\\+"/g, '"')
                                             .replace(/\[\[+|\]\]+/g, '')
                                             .replace(/^"|"$/g, '')
                                             .trim();
                                }
                                return item;
                            });
                        }
                        return [parsed];
                    }
                    
                    // Si ya es un array, limpiarlo
                    if (Array.isArray(data)) {
                        return data.map(item => {
                            if (typeof item === 'string') {
                                return item.replace(/\\+"/g, '"')
                                         .replace(/\[\[+|\]\]+/g, '')
                                         .replace(/^"|"$/g, '')
                                         .trim();
                            }
                            return item;
                        });
                    }
                    
                    return [data];
                } catch (e) {
                    console.error('Error al limpiar datos:', e);
                    // Si hay error, devolver el dato original en un array
                    return typeof data === 'string' ? [data] : [];
                }
            };

            // Limpiar ingredientes e instrucciones
            const ingredients = cleanData(event.ingredients);
            const instructions = cleanData(event.instructions);

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
            // Función para limpiar datos anidados
            const deepClean = (data) => {
                if (!data) return null;
                
                // Si es un string que parece un array JSON
                if (typeof data === 'string' && data.includes('[')) {
                    try {
                        // Intentar parsear el string
                        let parsed = JSON.parse(data);
                        // Si es un array, limpiarlo recursivamente
                        if (Array.isArray(parsed)) {
                            parsed = parsed.map(item => {
                                if (typeof item === 'string') {
                                    // Limpiar caracteres de escape y corchetes extras
                                    return item.replace(/\\+"/g, '"')
                                             .replace(/^\[+"|"+\]+$/g, '')
                                             .replace(/\\+/g, '');
                                }
                                return item;
                            });
                        }
                        return parsed;
                    } catch (e) {
                        // Si falla el parsing, limpiar el string directamente
                        return data.replace(/\\+"/g, '"')
                                 .replace(/^\[+"|"+\]+$/g, '')
                                 .replace(/\\+/g, '');
                    }
                }
                
                // Si es un array
                if (Array.isArray(data)) {
                    return data.map(item => {
                        if (typeof item === 'string') {
                            return item.replace(/\\+"/g, '"')
                                     .replace(/^\[+"|"+\]+$/g, '')
                                     .replace(/\\+/g, '');
                        }
                        return item;
                    });
                }
                
                return data;
            };

            // Limpiar y preparar los datos
            const cleanIngredients = deepClean(eventData.ingredients);
            const cleanInstructions = deepClean(eventData.instructions);

            const sanitizedData = {
                title: eventData.title || null,
                day: eventData.day || null,
                month: eventData.month || null,
                year: eventData.year || null,
                time_from: eventData.timeFrom || null,
                time_to: eventData.timeTo || null,
                ingredients: Array.isArray(cleanIngredients) ? cleanIngredients : [cleanIngredients],
                instructions: Array.isArray(cleanInstructions) ? cleanInstructions : [cleanInstructions]
            };

            // Convertir arrays a strings simples para la base de datos
            const dataForDb = {
                ...sanitizedData,
                ingredients: JSON.stringify(sanitizedData.ingredients),
                instructions: JSON.stringify(sanitizedData.instructions)
            };

            const [result] = await db.execute(
                `UPDATE calendar_events 
                SET title = COALESCE(?, title), 
                    day = COALESCE(?, day), 
                    month = COALESCE(?, month), 
                    year = COALESCE(?, year), 
                    time_from = COALESCE(?, time_from), 
                    time_to = COALESCE(?, time_to),
                    ingredients = ?,
                    instructions = ?
                WHERE id = ? AND user_id = ?`,
                [
                    dataForDb.title,
                    dataForDb.day,
                    dataForDb.month,
                    dataForDb.year,
                    dataForDb.time_from,
                    dataForDb.time_to,
                    dataForDb.ingredients,
                    dataForDb.instructions,
                    eventId,
                    userId
                ]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            // Devolver los datos limpios
            return {
                id: eventId,
                userId,
                ...sanitizedData
            };
        } catch (error) {
            console.error('Error detallado en update:', error);
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
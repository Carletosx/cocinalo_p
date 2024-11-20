const CalendarEvent = require('../models/CalendarEvent');

const calendarController = {
    getRecipes: async (req, res) => {
        try {
            const userId = req.user.id;
            console.log('Obteniendo recetas para usuario:', userId);
            
            const recipes = await CalendarEvent.getByUserId(userId);
            console.log('Recetas encontradas:', recipes);
            
            res.json({
                success: true,
                data: recipes
            });
        } catch (error) {
            console.error('Error al obtener recetas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener recetas',
                error: error.message
            });
        }
    },

    createEvent: async (req, res) => {
        try {
            const userId = req.user.id;
            const eventData = req.body;
            
            console.log('Datos recibidos en createEvent:', {
                userId,
                eventData,
                headers: req.headers
            });

            // Validar datos requeridos
            const requiredFields = ['title', 'day', 'month', 'year', 'timeFrom', 'timeTo'];
            const missingFields = requiredFields.filter(field => !eventData[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Faltan campos requeridos: ${missingFields.join(', ')}`
                });
            }

            // Validar formato de fecha y hora
            if (!Number.isInteger(eventData.day) || 
                !Number.isInteger(eventData.month) || 
                !Number.isInteger(eventData.year)) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos de fecha deben ser números enteros'
                });
            }

            const newEvent = await CalendarEvent.create(userId, eventData);
            console.log('Evento creado:', newEvent);

            res.status(201).json({
                success: true,
                data: newEvent,
                message: 'Evento creado exitosamente'
            });
        } catch (error) {
            console.error('Error detallado en createEvent:', {
                message: error.message,
                stack: error.stack,
                userId: req.user?.id,
                eventData: req.body
            });
            
            res.status(500).json({
                success: false,
                message: 'Error al crear evento',
                error: error.message
            });
        }
    },

    deleteRecipe: async (req, res) => {
        try {
            const userId = req.user.id;
            const { recipeId } = req.params;
            
            const deleted = await CalendarEvent.delete(recipeId, userId);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Receta no encontrada o no tienes permiso para eliminarla'
                });
            }
            
            res.json({
                success: true,
                message: 'Receta eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar receta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar receta',
                error: error.message
            });
        }
    }
};

module.exports = calendarController; 
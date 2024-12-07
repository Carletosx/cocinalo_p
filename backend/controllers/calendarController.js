const CalendarEvent = require('../models/CalendarEvent');

const formatTime = (time) => {
    if (!time) return null;
    return time.split(':').slice(0, 2).join(':');
};

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
            const { title, ...otherData } = req.body;
            const cleanTitle = title.replace(/^0+/, ''); //Eliminar ceros iniciales
            
            const eventData = {
                title: cleanTitle,
                ...otherData,
                timeFrom: formatTime(otherData.timeFrom),
                timeTo: formatTime(otherData.timeTo)
            };
            
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
    },

    getEventById: async (req, res) => {
        try {
            const userId = req.user.id;
            const eventId = parseInt(req.params.eventId);
            
            console.log('Buscando evento:', { userId, eventId });
            
            const event = await CalendarEvent.getById(eventId, userId);
            
            if (!event) {
                console.log('Evento no encontrado');
                return res.status(404).json({
                    success: false,
                    message: 'Evento no encontrado'
                });
            }
            
            // Agregar campos adicionales si es necesario
            const enrichedEvent = {
                ...event,
                isCompleted: false, // Podrías agregar esto a la base de datos más adelante
            };
            
            console.log('Evento encontrado:', enrichedEvent);
            res.json({
                success: true,
                data: enrichedEvent
            });
        } catch (error) {
            console.error('Error en getEventById:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el evento',
                error: error.message
            });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const userId = req.user.id;
            const { eventId } = req.params;
            const { title, ...otherData } = req.body;
            const cleanTitle = title.replace(/^0+/, ''); //Eliminar ceros iniciales
            
            const eventData = {
                title: cleanTitle,
                ...otherData,
                timeFrom: formatTime(otherData.timeFrom),
                timeTo: formatTime(otherData.timeTo)
            };
            
            const updatedEvent = await CalendarEvent.update(eventId, userId, eventData);
            
            if (!updatedEvent) {
                return res.status(404).json({
                    success: false,
                    message: 'Evento no encontrado o no tienes permiso para editarlo'
                });
            }
            
            res.json({
                success: true,
                data: updatedEvent,
                message: 'Evento actualizado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el evento',
                error: error.message
            });
        }
    },

    markEventAsCompleted: async (req, res) => {
        try {
            const userId = req.user.id;
            const { eventId } = req.params;

            await CalendarEvent.markAsCompleted(eventId, userId);

            res.json({
                success: true,
                message: 'Evento marcado como completado exitosamente'
            });
        } catch (error) {
            console.error('Error al marcar evento como completado:', error);
            res.status(500).json({
                success: false,
                message: 'Error al marcar el evento como completado',
                error: error.message
            });
        }
    },

    updateIngredientChecklist: async (req, res) => {
        try {
            const userId = req.user.id;
            const { eventId } = req.params;
            const { ingredients } = req.body;

            await CalendarEvent.updateIngredientChecklist(eventId, userId, ingredients);

            res.json({
                success: true,
                message: 'Checklist actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar checklist:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el checklist',
                error: error.message
            });
        }
    },

    deleteEvent: async (req, res) => {
        const { eventId } = req.params;
        const userId = req.user.id;

        try {
            console.log('Eliminando evento:', { eventId, userId });
            await CalendarEvent.delete(eventId, userId);
            
            res.json({
                success: true,
                message: 'Evento eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar receta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el evento'
            });
        }
    }
};

module.exports = calendarController; 
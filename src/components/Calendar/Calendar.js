    import React, { useState, useEffect } from 'react';
    import axios from '../../api/axios';
    import CalendarGrid from './CalendarGrid';
    import CalendarHeader from './CalendarHeader';
    import EventForm from './EventForm';
    import Alert from '../Alert/Alert';
    import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
    import EventDetailView from './EventDetailView';
    import './Calendar.scss';

    const Calendar = () => {
        const [currentDate, setCurrentDate] = useState(new Date());
        const [recipes, setRecipes] = useState([]);
        const [showRecipeForm, setShowRecipeForm] = useState(false);
        const [selectedDate, setSelectedDate] = useState(null);
        const [alert, setAlert] = useState({ show: false, message: '', type: '' });
        const [confirmDialog, setConfirmDialog] = useState({
            isOpen: false,
            recipeId: null,
            recipeName: ''
        });
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [isEditing, setIsEditing] = useState(false);
        const [showDetailView, setShowDetailView] = useState(false);
        const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);

        useEffect(() => {
            const fetchRecipes = async () => {
                try {
                    const response = await axios.get('/calendar/events');
                    if (response?.data?.data) {
                        const processedRecipes = response.data.data.map(recipe => ({
                            ...recipe,
                            timeFrom: recipe.time_from ? recipe.time_from.slice(0, 5) : '',
                            timeTo: recipe.time_to ? recipe.time_to.slice(0, 5) : ''
                        }));
                        setRecipes(processedRecipes);
                    }
                } catch (error) {
                    console.error('Error al cargar las recetas:', error);
                    setAlert({
                        show: true,
                        message: 'Error al cargar las recetas',
                        type: 'error'
                    });
                }
            };

            fetchRecipes();
        }, [currentDate]);

        const handleRecipeAdd = async (recipeData) => {
            try {
                const formattedData = {
                    ...recipeData,
                    timeFrom: recipeData.timeFrom,
                    timeTo: recipeData.timeTo
                };

                console.log('Enviando datos:', formattedData);
                const response = await axios.post('/calendar/events', formattedData);
                
                if (response.data && response.data.data) {
                    const newRecipe = {
                        id: response.data.data.id,
                        title: formattedData.title,
                        day: parseInt(formattedData.day),
                        month: parseInt(formattedData.month),
                        year: parseInt(formattedData.year),
                        timeFrom: formattedData.timeFrom,
                        timeTo: formattedData.timeTo
                    };

                    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
                    setShowRecipeForm(false);
                    
                    setAlert({
                        show: true,
                        message: `¡Receta "${formattedData.title}" agregada exitosamente!`,
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error('Error completo:', error.response || error);
                setAlert({
                    show: true,
                    message: 'No se pudo guardar la receta. Por favor, intenta nuevamente.',
                    type: 'error'
                });
            }
        };

        const handleRecipeDelete = async (recipeId) => {
            const recipe = recipes.find(r => r.id === recipeId);
            setConfirmDialog({
                isOpen: true,
                recipeId: recipeId,
                recipeName: recipe?.title || 'esta receta'
            });
        };

        const confirmDelete = async () => {
            try {
                const recipeId = confirmDialog.recipeId;
                await axios.delete(`/calendar/events/${recipeId}`);
                
                setRecipes(prevRecipes => 
                    prevRecipes.filter(recipe => recipe.id !== recipeId)
                );
                
                setAlert({
                    show: true,
                    message: `Se eliminó "${confirmDialog.recipeName}" correctamente`,
                    type: 'success'
                });
            } catch (error) {
                console.error('Error al eliminar:', error);
                setAlert({
                    show: true,
                    message: 'Error al eliminar la receta. Por favor, intenta nuevamente.',
                    type: 'error'
                });
            } finally {
                setConfirmDialog({ isOpen: false, recipeId: null, recipeName: '' });
            }
        };

        const handleDateClick = (date) => {
            setSelectedDate(date);
            setShowRecipeForm(true);
        };

        const handleEventView = async (event) => {
            try {
                console.log('Intentando ver evento:', event);
                const response = await axios.get(`/calendar/events/${event.id}`);
                console.log('Respuesta del servidor:', response);
                
                if (response.data.success) {
                    setSelectedEventForDetail(response.data.data);
                    setShowDetailView(true);
                }
            } catch (error) {
                console.error('Error detallado:', {
                    config: error.config,
                    response: error.response,
                    message: error.message
                });
                
                setAlert({
                    show: true,
                    message: 'Error al cargar los detalles del evento: ' + 
                            (error.response?.data?.message || error.message),
                    type: 'error'
                });
            }
        };

        const handleEventEdit = async (event) => {
            try {
                console.log('Intentando editar evento:', event);
                const response = await axios.get(`/calendar/events/${event.id}`);
                console.log('Respuesta del servidor:', response);
                
                if (response.data.success) {
                    setSelectedEvent(response.data.data);
                    setShowRecipeForm(true);
                    setIsEditing(true);
                }
            } catch (error) {
                console.error('Error detallado:', {
                    config: error.config,
                    response: error.response,
                    message: error.message
                });
                
                setAlert({
                    show: true,
                    message: 'Error al cargar el evento para editar: ' + 
                            (error.response?.data?.message || error.message),
                    type: 'error'
                });
            }
        };

        const handleEventUpdate = async (eventId, eventData) => {
            try {
                console.log('Datos a enviar:', { eventId, eventData });
                
                const response = await axios.put(`/calendar/events/${eventId}`, eventData);
                
                if (response.data) {
                    // Recargar los eventos
                    const eventsResponse = await axios.get('/calendar/events');
                    if (eventsResponse?.data?.data) {
                        const processedRecipes = eventsResponse.data.data.map(recipe => ({
                            ...recipe,
                            timeFrom: recipe.time_from ? recipe.time_from.slice(0, 5) : '',
                            timeTo: recipe.time_to ? recipe.time_to.slice(0, 5) : ''
                        }));
                        setRecipes(processedRecipes);
                    }

                    setSelectedEvent(null);
                    setShowRecipeForm(false);
                    setIsEditing(false);

                    setAlert({
                        show: true,
                        message: 'Evento actualizado exitosamente',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error('Error detallado:', error.response || error);
                setAlert({
                    show: true,
                    message: 'Error al actualizar el evento: ' + (error.response?.data?.message || error.message),
                    type: 'error'
                });
            }
        };

        const handleEventComplete = async (eventId) => {
            try {
                const response = await axios.post(`/calendar/events/${eventId}/complete`);
                
                if (response.data.success) {
                    setRecipes(prevRecipes => 
                        prevRecipes.map(recipe => 
                            recipe.id === eventId 
                                ? { ...recipe, isCompleted: true }
                                : recipe
                        )
                    );
                }
            } catch (error) {
                console.error('Error al completar el evento:', error);
                setAlert({
                    show: true,
                    message: 'Error al completar la receta',
                    type: 'error'
                });
            }
        };

        const handleEventDelete = async (eventId) => {
            try {
                const response = await axios.delete(`/calendar/events/${eventId}`);
                
                if (response.data.success) {
                    setRecipes(prevRecipes => 
                        prevRecipes.filter(recipe => recipe.id !== eventId)
                    );
                    setAlert({
                        show: true,
                        message: 'Receta eliminada exitosamente',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.error('Error al eliminar el evento:', error);
                setAlert({
                    show: true,
                    message: 'Error al eliminar la receta',
                    type: 'error'
                });
            }
        };

        return (
            <div className="calendar">
                <CalendarHeader 
                    currentDate={currentDate}
                    onPrevMonth={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(currentDate.getMonth() - 1);
                        setCurrentDate(newDate);
                    }}
                    onNextMonth={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(currentDate.getMonth() + 1);
                        setCurrentDate(newDate);
                    }}
                />

                <div className="calendar-content-wrapper">
                    <CalendarGrid 
                        currentDate={currentDate}
                        events={recipes}
                        onDateClick={handleDateClick}
                        onEventDelete={handleRecipeDelete}
                        onEventView={handleEventView}
                        onEventEdit={handleEventEdit}
                    />
                </div>

                {showRecipeForm && (
                    <EventForm 
                        selectedDate={selectedDate}
                        currentDate={currentDate}
                        onSubmit={isEditing ? handleEventUpdate : handleRecipeAdd}
                        onClose={() => {
                            setShowRecipeForm(false);
                            setSelectedEvent(null);
                            setIsEditing(false);
                        }}
                        initialData={selectedEvent}
                        isEditing={isEditing}
                    />
                )}

                {alert.show && (
                    <Alert 
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert({ show: false, message: '', type: '' })}
                    />
                )}

                <ConfirmDialog 
                    isOpen={confirmDialog.isOpen}
                    message={`¿Estás seguro de que deseas eliminar "${confirmDialog.recipeName}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmDialog({ isOpen: false, recipeId: null, recipeName: '' })}
                />

                {showDetailView && selectedEventForDetail && (
                    <EventDetailView 
                        event={selectedEventForDetail}
                        onClose={() => {
                            setShowDetailView(false);
                            setSelectedEventForDetail(null);
                        }}
                        onComplete={handleEventComplete}
                        onDelete={handleEventDelete}
                    />
                )}
            </div>
        );
    };

    export default Calendar; 
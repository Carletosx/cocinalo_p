import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import CalendarGrid from './CalendarGrid';
import CalendarHeader from './CalendarHeader';
import EventForm from './EventForm';
import Alert from '../Alert/Alert';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
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

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token disponible:', !!token);
                
                console.log('Iniciando petición GET a /calendar/events');
                const response = await axios.get('/calendar/events');
                console.log('Respuesta del servidor:', response.data);
                
                if (response?.data?.data) {
                    console.log('Recetas recibidas:', response.data.data);
                    setRecipes(response.data.data);
                } else {
                    console.warn('No hay datos en la respuesta');
                }
            } catch (error) {
                console.error('Error detallado:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.config?.headers
                });
                setAlert({
                    show: true,
                    message: error.response?.data?.message || 'Error al cargar las recetas',
                    type: 'error'
                });
            }
        };

        fetchRecipes();
    }, []);

    const handleRecipeAdd = async (recipeData) => {
        try {
            console.log('Enviando datos:', recipeData);
            const response = await axios.post('/calendar/events', recipeData);
            console.log('Respuesta:', response.data);
            
            if (response.data && response.data.data) {
                const newRecipe = {
                    id: response.data.data.id,
                    title: recipeData.title,
                    day: parseInt(recipeData.day),
                    month: parseInt(recipeData.month),
                    year: parseInt(recipeData.year),
                    timeFrom: recipeData.timeFrom,
                    timeTo: recipeData.timeTo
                };

                setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
                setShowRecipeForm(false);
                
                setAlert({
                    show: true,
                    message: `¡Receta "${recipeData.title}" agregada exitosamente!`,
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
                />
            </div>

            {showRecipeForm && (
                <EventForm 
                    selectedDate={selectedDate}
                    currentDate={currentDate}
                    onSubmit={handleRecipeAdd}
                    onClose={() => setShowRecipeForm(false)}
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
        </div>
    );
};

export default Calendar; 
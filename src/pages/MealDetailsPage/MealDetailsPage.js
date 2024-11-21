import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./MealDetailsPage.scss";
import CategoryList from '../../components/Category/CategoryList';
import MealSingle from "../../components/Meal/MealSingle";
import { useMealContext } from '../../context/mealContext';
import { startFetchSingleMeal } from '../../actions/mealsActions';
import Loader from '../../components/Loader/Loader';
import EventForm from '../../components/Calendar/EventForm';
import Alert from '../../components/Alert/Alert';
import axios from '../../api/axios';

const MealDetailsPage = () => {
    const { id } = useParams();
    const [showEventForm, setShowEventForm] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const { categories, dispatch, meal, categoryLoading, mealLoading } = useMealContext();

    useEffect(() => {
        startFetchSingleMeal(dispatch, id);
    }, [dispatch, id]);

    const handleScheduleMeal = () => {
        setShowEventForm(true);
    };

    const handleEventSubmit = async (formData) => {
        try {
            if (!formData || !formData.day || !formData.month || !formData.year || !formData.timeFrom || !formData.timeTo) {
                throw new Error('Todos los campos son requeridos');
            }

            const formatTime = (time) => {
                if (!time) return null;
                return time.split(':').slice(0, 2).join(':');
            };

            const eventData = {
                title: meal.nombre_receta,
                day: formData.day,
                month: formData.month,
                year: formData.year,
                timeFrom: formatTime(formData.timeFrom),
                timeTo: formatTime(formData.timeTo),
                recipeId: parseInt(meal.id_receta) || null
            };

            console.log('Datos a enviar al servidor:', eventData);

            const response = await axios.post('/calendar/events', eventData);
            
            if (response.data.success) {
                setShowEventForm(false);
                setAlert({
                    show: true,
                    message: '¡Receta agendada exitosamente!',
                    type: 'success'
                });
            } else {
                throw new Error(response.data.message || 'Error al crear evento');
            }
        } catch (error) {
            console.error('Error al crear evento:', {
                message: error.message,
                formData,
                response: error.response?.data
            });
            
            setAlert({
                show: true,
                message: error.message || 'Error al agendar la receta',
                type: 'error'
            });
        }
    };

    if (mealLoading) return <Loader />;
    if (!meal) return <div>No se encontraron detalles de la receta.</div>;

    const singleMeal = {
        id: meal.id_receta,
        nombre_receta: meal.nombre_receta,
        nombre_categoria: meal.nombre_categoria,
        imagen_url: meal.imagen_url,
        dificultad: meal.dificultad,
        ingredientes: meal.ingredientes,
        instrucciones: meal.instrucciones
    };

    return (
        <main className='main-content bg-whitesmoke'>
            <MealSingle 
                meal={singleMeal} 
                onSchedule={handleScheduleMeal}
            />
            
            {showEventForm && (
                <EventForm
                    selectedDate={new Date().getDate()}
                    currentDate={new Date()}
                    recipeName={meal.nombre_receta}
                    onSubmit={handleEventSubmit}
                    onClose={() => setShowEventForm(false)}
                />
            )}

            {alert.show && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: '', type: '' })}
                />
            )}

            {categoryLoading ? <Loader /> : <CategoryList categories={categories} />}
        </main>
    );
};

export default MealDetailsPage;

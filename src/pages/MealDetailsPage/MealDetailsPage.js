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
import axios from 'axios';

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
        // Extraer fecha del formData
        const date = new Date(formData.date);
        
        // Preparar los datos en el formato que espera el backend
        const eventData = {
            title: meal.nombre_receta,
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            timeFrom: formData.timeFrom,
            timeTo: formData.timeTo,
            recipeId: meal.id_receta
        };

        console.log('Enviando datos:', eventData);

        // Usar axios en lugar de fetch para mantener las cookies de sesión
        const response = await axios.post('/calendar/events', eventData);

        if (response.data.success) {
            // Actualizar el estado local del calendario
            const events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
            events.push(response.data.data);
            localStorage.setItem('calendarEvents', JSON.stringify(events));

            setShowEventForm(false);
            setAlert({
                show: true,
                message: 'La receta se ha agendado correctamente en el calendario',
                type: 'success'
            });

            setTimeout(() => {
                setAlert({ show: false, message: '', type: '' });
            }, 3000);
        } else {
            throw new Error(response.data.message || 'Error al guardar el evento');
        }
    } catch (error) {
        console.error('Error completo:', error);
        setAlert({
            show: true,
            message: error.response?.data?.message || 'Hubo un error al agendar la receta. Por favor, intenta nuevamente',
            type: 'error'
        });
    }
  };

  if (mealLoading) {
    return <Loader />;
  }

  if (!meal) {
    return <div>No se encontraron detalles de la receta.</div>;
  }

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
}

export default MealDetailsPage;

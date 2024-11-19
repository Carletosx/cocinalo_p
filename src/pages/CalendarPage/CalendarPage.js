import React from 'react';
import Calendar from '../../components/Calendar/Calendar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './CalendarPage.scss';

const CalendarPage = () => {
    const { user } = useAuth();

    // Redirigir a login si no hay usuario autenticado
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="calendar-page">
            <div className="calendar-page-header">
                <h1>Mi Calendario de Recetas</h1>
                <p>Organiza tus comidas y planifica tu semana</p>
            </div>
            <Calendar />
        </div>
    );
};

export default CalendarPage; 
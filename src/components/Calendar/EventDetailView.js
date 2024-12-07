import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import './EventDetailView.scss';
import axios from 'axios';

const EventDetailView = ({ event, onClose }) => {
    // Estado para el checklist de ingredientes
    const [ingredientChecklist, setIngredientChecklist] = useState({});
    // Estado para el temporizador
    const [timer, setTimer] = useState({
        minutes: 0,
        seconds: 0,
        isRunning: false,
        intervalId: null
    });
    // Estado para marcar la receta como completada
    const [isCompleted, setIsCompleted] = useState(false);

    // Manejador para el checklist de ingredientes
    const handleIngredientCheck = async (ingredient) => {
        try {
            const newChecklist = {
                ...ingredientChecklist,
                [ingredient]: !ingredientChecklist[ingredient]
            };
            
            setIngredientChecklist(newChecklist);

            await axios.post(`/calendar/events/${event.id}/checklist`, {
                ingredients: newChecklist
            });
        } catch (error) {
            console.error('Error al actualizar checklist:', error);
        }
    };

    // Cargar el estado del checklist al montar el componente
    useEffect(() => {
        const loadChecklist = async () => {
            try {
                const response = await axios.get(`/calendar/events/${event.id}/checklist`);
                if (response.data.success) {
                    setIngredientChecklist(response.data.data);
                }
            } catch (error) {
                console.error('Error al cargar checklist:', error);
            }
        };

        loadChecklist();
    }, [event.id]);

    // Manejadores del temporizador
    const startTimer = () => {
        if (!timer.isRunning) {
            const intervalId = setInterval(() => {
                setTimer(prev => {
                    const newSeconds = prev.seconds + 1;
                    return {
                        ...prev,
                        minutes: Math.floor(newSeconds / 60),
                        seconds: newSeconds % 60,
                        isRunning: true
                    };
                });
            }, 1000);
            setTimer(prev => ({ ...prev, intervalId, isRunning: true }));
        }
    };

    const stopTimer = () => {
        if (timer.intervalId) {
            clearInterval(timer.intervalId);
            setTimer(prev => ({ ...prev, isRunning: false, intervalId: null }));
        }
    };

    const resetTimer = () => {
        stopTimer();
        setTimer({ minutes: 0, seconds: 0, isRunning: false, intervalId: null });
    };

    // Manejador para completar la receta
    const handleComplete = async () => {
        try {
            const response = await axios.post(`/calendar/events/${event.id}/complete`);
            if (response.data.success) {
                setIsCompleted(true);
                // Opcional: Mostrar un mensaje de éxito
            }
        } catch (error) {
            console.error('Error al completar el evento:', error);
            // Opcional: Mostrar un mensaje de error
        }
    };

    return (
        <div className="event-detail-view-overlay">
            <div className="event-detail-view">
                <div className="event-detail-header">
                    <h2>{event.title}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <IoMdClose />
                    </button>
                </div>

                <div className="event-detail-content">
                    {/* Información básica */}
                    <div className="event-info">
                        <p className="event-time">
                            🕒 {event.timeFrom} - {event.timeTo}
                        </p>
                        <p className="event-date">
                            📅 {event.day}/{event.month}/{event.year}
                        </p>
                    </div>

                    {/* Ingredientes con checklist */}
                    <div className="ingredients-section">
                        <h3>Ingredientes</h3>
                        <div className="ingredients-checklist">
                            {event.ingredients?.map((ingredient, index) => (
                                <label key={index} className="ingredient-item">
                                    <input
                                        type="checkbox"
                                        checked={ingredientChecklist[ingredient] || false}
                                        onChange={() => handleIngredientCheck(ingredient)}
                                    />
                                    <span>{ingredient}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Instrucciones */}
                    <div className="instructions-section">
                        <h3>Instrucciones</h3>
                        <ol className="instructions-list">
                            {event.instructions?.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
                    </div>

                    {/* Temporizador */}
                    <div className="timer-section">
                        <h3>Temporizador</h3>
                        <div className="timer-display">
                            {String(timer.minutes).padStart(2, '0')}:
                            {String(timer.seconds).padStart(2, '0')}
                        </div>
                        <div className="timer-controls">
                            <button 
                                onClick={timer.isRunning ? stopTimer : startTimer}
                                className={timer.isRunning ? 'stop' : 'start'}
                            >
                                {timer.isRunning ? 'Pausar' : 'Iniciar'}
                            </button>
                            <button onClick={resetTimer} className="reset">
                                Reiniciar
                            </button>
                        </div>
                    </div>

                    {/* Botón de completado */}
                    <button
                        className={`complete-button ${isCompleted ? 'completed' : ''}`}
                        onClick={handleComplete}
                        disabled={isCompleted}
                    >
                        {isCompleted ? '✓ Completada' : 'Marcar como completada'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailView; 
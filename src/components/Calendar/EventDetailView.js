import React, { useState, useEffect } from 'react';
import{ IoMdClose } from 'react-icons/io';
import './EventDetailView.scss';

const EventDetailView = ({ event, onClose, onComplete, onDelete }) => {
    const [isCompleted, setIsCompleted] = useState(event.isCompleted || false);
    const [timer, setTimer] = useState({
        minutes: 0,
        seconds: 0,
        isRunning: false,
        intervalId: null
    });

    // Funciones del temporizador
    const startTimer = () => {
        if (!timer.isRunning) {
            const intervalId = setInterval(() => {
                setTimer(prevTimer => {
                    const newSeconds = prevTimer.seconds + 1;
                    if (newSeconds === 60) {
                        return {
                            ...prevTimer,
                            minutes: prevTimer.minutes + 1,
                            seconds: 0,
                            isRunning: true,
                            intervalId
                        };
                    }
                    return {
                        ...prevTimer,
                        seconds: newSeconds,
                        isRunning: true,
                        intervalId
                    };
                });
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (timer.intervalId) {
            clearInterval(timer.intervalId);
            setTimer(prev => ({
                ...prev,
                isRunning: false,
                intervalId: null
            }));
        }
    };

    const resetTimer = () => {
        stopTimer();
        setTimer({
            minutes: 0,
            seconds: 0,
            isRunning: false,
            intervalId: null
        });
    };

    // Limpiar el intervalo cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (timer.intervalId) {
                clearInterval(timer.intervalId);
            }
        };
    }, [timer.intervalId]);

    // Manejar los ingredientes e instrucciones que vienen como array o string
    const formatIngredients = (ingredients) => {
        if (!ingredients) return [];
        if (Array.isArray(ingredients)) return ingredients;
        return ingredients.split(',').map(ing => ing.trim());
    };

    const formatInstructions = (instructions) => {
        if (!instructions) return [];
        if (Array.isArray(instructions)) return instructions;
        return instructions.split('.').filter(inst => inst.trim()).map(inst => inst.trim());
    };

    // Usar las funciones de formato
    const ingredients = formatIngredients(event.ingredients);
    const instructions = formatInstructions(event.instructions);

    console.log('Datos del evento en DetailView:', {
        event,
        ingredients,
        instructions
    });

    const handleComplete = async () => {
        try {
            await onComplete(event.id);
            setIsCompleted(true);
        } catch (error) {
            console.error('Error al completar evento:', error);
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
                    <div className="time-section">
                        <h3>Horario</h3>
                        <p>🕒 {event.timeFrom} - {event.timeTo}</p>
                    </div>

                    {ingredients && ingredients.length > 0 && (
                        <div className="ingredients-section">
                            <h3>Ingredientes</h3>
                            <ul className="ingredients-list">
                                {ingredients.map((ingredient, idx) => (
                                    <li key={idx} className="ingredient-item">
                                        <span className="bullet">•</span>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {instructions && instructions.length > 0 && (
                        <div className="instructions-section">
                            <h3>Instrucciones</h3>
                            <ol className="instructions-list">
                                {instructions.map((instruction, idx) => (
                                    <li key={idx} className="instruction-item">
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

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

                    <div className="action-buttons">
                        <button
                            className={`complete-button ${isCompleted ? 'completed' : ''}`}
                            onClick={handleComplete}
                            disabled={isCompleted}
                        >
                            {isCompleted ? '✓ Completada' : 'Marcar como completada'}
                        </button>
                        
                        <button
                            className="delete-button"
                            onClick={() => onDelete(event.id)}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailView; 
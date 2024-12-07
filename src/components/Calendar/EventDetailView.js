import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Alert from '../Alert/Alert';
import './EventDetailView.scss';

const EventDetailView = ({ event, onClose, onComplete, onDelete }) => {
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
    const [isCompleted, setIsCompleted] = useState(event.isCompleted || false);
    const [showAlert, setShowAlert] = useState(false);

    // Manejador para el checklist de ingredientes
    const handleIngredientCheck = (ingredient) => {
        setIngredientChecklist(prev => ({
            ...prev,
            [ingredient]: !prev[ingredient]
        }));
    };

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
            await onComplete(event.id);
            setIsCompleted(true);
            setShowAlert(true); // Mostrar alerta
            
            // Cerrar la vista después de un momento
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error al completar el evento:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await onDelete(event.id);
            onClose();
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
        }
    };

    return (
        <div className="event-detail-view-overlay">
            {showAlert && (
                <Alert
                    type="success"
                    message={`¡La receta "${event.title}" ha sido marcada como completada!`}
                    onClose={() => setShowAlert(false)}
                />
            )}
            
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
                            onClick={handleDelete}
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
import React, { useState, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import './EventView.scss';

const EventView = ({ event, onComplete, onClose }) => {
    const [isCompleted, setIsCompleted] = useState(event.completed);
    const { time, isRunning, startTimer, pauseTimer, resetTimer } = useTimer();

    const handleComplete = async () => {
        try {
            await onComplete(event.id);
            setIsCompleted(true);
        } catch (error) {
            console.error('Error al completar evento:', error);
        }
    };

    return (
        <div className="event-view">
            <div className="event-view-header">
                <h3>{event.title}</h3>
                <span className={`status-badge ${isCompleted ? 'completed' : ''}`}>
                    {isCompleted ? 'Completada' : 'Pendiente'}
                </span>
            </div>

            <div className="event-view-content">
                <div className="time-section">
                    <h4>Horario</h4>
                    <p>{event.timeFrom} - {event.timeTo}</p>
                </div>

                {event.ingredients && (
                    <div className="ingredients-section">
                        <h4>Ingredientes</h4>
                        <ul>
                            {event.ingredients.split(',').map((ing, idx) => (
                                <li key={idx}>{ing.trim()}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {event.instructions && (
                    <div className="instructions-section">
                        <h4>Instrucciones</h4>
                        <ol>
                            {event.instructions.split('.').filter(inst => inst.trim()).map((inst, idx) => (
                                <li key={idx}>{inst.trim()}</li>
                            ))}
                        </ol>
                    </div>
                )}

                <div className="timer-section">
                    <h4>Temporizador</h4>
                    <div className="timer-display">{time}</div>
                    <div className="timer-controls">
                        <button onClick={isRunning ? pauseTimer : startTimer}>
                            {isRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={resetTimer}>Reiniciar</button>
                    </div>
                </div>

                {!isCompleted && (
                    <button 
                        className="complete-btn"
                        onClick={handleComplete}
                    >
                        Marcar como completada
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventView;
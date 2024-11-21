import React from 'react';
import { IoMdClose } from 'react-icons/io';

const CalendarGrid = ({ currentDate, events, onDateClick, onEventDelete }) => {
    const formatTimeDisplay = (time) => {
        if (!time) return '';
        return time.split(':').slice(0, 2).join(':');  // Solo toma HH:mm
    };

    const getEventsForDate = (date) => {
        const dateEvents = events.filter(event => 
            event.day === date &&
            event.month === currentDate.getMonth() + 1 &&
            event.year === currentDate.getFullYear()
        );

        return dateEvents.sort((a, b) => {
            const getMinutes = (timeStr) => {
                if (!timeStr) return 0;
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const aTime = a?.timeFrom || '00:00';
            const bTime = b?.timeFrom || '00:00';

            const aMinutes = getMinutes(aTime);
            const bMinutes = getMinutes(bTime);

            return aMinutes - bMinutes;
        });
    };

    // Obtener el primer día del mes (0 = Domingo, 1 = Lunes, etc.)
    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    // Obtener el número de días en el mes
    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    // Crear array para los días del mes
    const days = Array.from({ length: 42 }, (_, index) => {
        const dayNumber = index - firstDayOfMonth + 1;
        if (dayNumber > 0 && dayNumber <= daysInMonth) {
            return dayNumber;
        }
        return null;
    });

    const isToday = (date) => {
        const today = new Date();
        return date === today.getDate() && 
               currentDate.getMonth() === today.getMonth() && 
               currentDate.getFullYear() === today.getFullYear();
    };

    return (
        <div className="calendar-grid">
            {/* Encabezados de días */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="calendar-day-header">{day}</div>
            ))}

            {/* Días del mes */}
            {days.map((day, index) => (
                <div 
                    key={index} 
                    className={`calendar-day ${!day ? 'empty-day' : ''} 
                        ${day && isToday(day) ? 'today' : ''}`}
                    onClick={() => day && onDateClick(day)}
                >
                    {day && (
                        <>
                            <span className="date-number">{day}</span>
                            <div className="events-container">
                                {getEventsForDate(day).map(event => (
                                    <div key={event.id} className="event-item">
                                        <div className="event-content">
                                            <span className="event-title">
                                                {event.title || 'Sin título'}
                                            </span>
                                            <button 
                                                className="delete-event"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventDelete(event.id);
                                                }}
                                                title="Eliminar receta"
                                            >
                                                <IoMdClose />
                                            </button>
                                        </div>
                                        <span className="event-time">
                                            🕒 {formatTimeDisplay(event.timeFrom)} - {formatTimeDisplay(event.timeTo)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CalendarGrid; 
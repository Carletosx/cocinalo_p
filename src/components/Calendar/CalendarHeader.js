import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth }) => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className="calendar-header">
            <button onClick={onPrevMonth} className="month-nav-btn">
                <IoIosArrowBack />
            </button>
            
            <h2>
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button onClick={onNextMonth} className="month-nav-btn">
                <IoIosArrowForward />
            </button>
        </div>
    );
};

export default CalendarHeader; 
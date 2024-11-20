import React, { createContext, useContext, useState } from 'react';

const CalendarContext = createContext();

export const useCalendar = () => {
    return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
    const [events, setEvents] = useState([]);

    const value = {
        events,
        setEvents
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}; 
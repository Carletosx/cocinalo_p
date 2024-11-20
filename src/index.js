import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SidebarProvider } from './context/sidebarContext';
import { MealProvider } from './context/mealContext';
import { CalendarProvider } from './context/CalendarContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SidebarProvider>
    <MealProvider>
      <CalendarProvider>
        <App />
      </CalendarProvider>
    </MealProvider>
  </SidebarProvider>
);


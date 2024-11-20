import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Alert from '../Alert/Alert';
import { useMealContext } from '../../context/mealContext';
import './EventForm.scss';

const EventForm = ({ selectedDate, currentDate, recipeName, onSubmit, onClose }) => {
    const { categoryMeals } = useMealContext();
    const [formData, setFormData] = useState(() => {
        const initialDate = formatDateForInput(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)
        );
        
        return {
            title: recipeName || '',
            date: initialDate,
            timeFrom: '',
            timeTo: ''
        };
    });

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    function formatDateForInput(date) {
        try {
            const d = new Date(date);
            
            if (isNaN(d.getTime())) {
                console.error('Fecha inválida:', date);
                return new Date().toISOString().split('T')[0];
            }

            let month = (d.getMonth() + 1).toString();
            let day = d.getDate().toString();
            const year = d.getFullYear();

            month = month.padStart(2, '0');
            day = day.padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return new Date().toISOString().split('T')[0];
        }
    }

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setFormData(prev => ({
            ...prev,
            date: newDate
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'title' && !recipeName) {
            setShowSuggestions(value.length > 0);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.date || !formData.timeFrom || !formData.timeTo) {
            setAlert({
                show: true,
                message: 'Por favor completa todos los campos',
                type: 'error'
            });
            return;
        }

        try {
            const selectedDate = new Date(formData.date + 'T00:00:00');
            
            const timeFrom = formData.timeFrom.split(':').slice(0, 2).join(':');
            const timeTo = formData.timeTo.split(':').slice(0, 2).join(':');

            const finalData = {
                title: formData.title,
                day: selectedDate.getDate(),
                month: selectedDate.getMonth() + 1,
                year: selectedDate.getFullYear(),
                timeFrom: timeFrom,
                timeTo: timeTo
            };

            console.log('Datos a enviar:', {
                fecha_original: formData.date,
                fecha_procesada: selectedDate,
                datos_finales: finalData
            });

            onSubmit(finalData);
        } catch (error) {
            console.error('Error al procesar el formulario:', error);
            setAlert({
                show: true,
                message: 'Error al procesar los datos del formulario',
                type: 'error'
            });
        }
    };

    const getSuggestions = (input) => {
        if (!input) return [];
        return categoryMeals
            .filter(meal => 
                meal.nombre_receta.toLowerCase().includes(input.toLowerCase())
            )
            .slice(0, 5);
    };

    const handleSelectSuggestion = (recipeName) => {
        setFormData(prev => ({
            ...prev,
            title: recipeName
        }));
        setShowSuggestions(false);
    };

    return (
        <div className="event-form-overlay">
            <div className="event-form">
                <div className="event-form-header">
                    <h3>{recipeName ? `Agendar: ${recipeName}` : 'Agregar Receta'}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <IoMdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Nombre de la Receta</label>
                        <div className="input-container">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Ingresa el nombre de la receta"
                                required
                                readOnly={!!recipeName}
                            />
                            {!recipeName && showSuggestions && (
                                <div className="suggestions-list">
                                    {getSuggestions(formData.title).map((meal, idx) => (
                                        <div 
                                            key={idx}
                                            className="suggestion-item"
                                            onClick={() => handleSelectSuggestion(meal.nombre_receta)}
                                        >
                                            {meal.nombre_receta}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Fecha</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleDateChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="timeFrom">Hora Inicio</label>
                            <input
                                type="time"
                                id="timeFrom"
                                name="timeFrom"
                                value={formData.timeFrom}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="timeTo">Hora Fin</label>
                            <input
                                type="time"
                                id="timeTo"
                                name="timeTo"
                                value={formData.timeTo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        Guardar Receta
                    </button>
                </form>

                {alert.show && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert({ show: false, message: '', type: '' })}
                    />
                )}
            </div>
        </div>
    );
};

export default EventForm; 
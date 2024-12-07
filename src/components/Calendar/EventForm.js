import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Alert from '../Alert/Alert';
import { useMealContext } from '../../context/mealContext';
import './EventForm.scss';

const EventForm = ({ 
    selectedDate, 
    currentDate, 
    recipeName, 
    onSubmit, 
    onClose,
    initialData,
    isEditing,
    isViewOnly 
}) => {
    const { categoryMeals } = useMealContext();
    const [formData, setFormData] = useState(() => {
        if (initialData) {
            return {
                title: initialData.title,
                date: formatDateForInput(
                    new Date(initialData.year, initialData.month - 1, initialData.day)
                ),
                timeFrom: initialData.timeFrom,
                timeTo: initialData.timeTo
            };
        }

        const initialDate = formatDateForInput(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)
        );
        
        const now = new Date();
        const defaultTimeFrom = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const laterHour = new Date(now.getTime() + 60 * 60 * 1000);
        const defaultTimeTo = `${String(laterHour.getHours()).padStart(2, '0')}:${String(laterHour.getMinutes()).padStart(2, '0')}`;
        
        return {
            title: recipeName || '',
            date: initialDate,
            timeFrom: defaultTimeFrom,
            timeTo: defaultTimeTo
        };
    });

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    function formatDateForInput(date) {
        try {
            const d = new Date(date);
            
            if (isNaN(d.getTime())) {
                console.error('Fecha inválida:', date);
                return new Date().toISOString().split('T')[0];
            }

            const tzOffset = d.getTimezoneOffset() * 60000; // offset en milisegundos
            const localDate = new Date(d.getTime() + tzOffset);

            let month = (localDate.getMonth() + 1).toString();
            let day = localDate.getDate().toString();
            const year = localDate.getFullYear();

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

    const formatTime = (time) => {
        if (!time) return '';
        // Asegurarse de que el tiempo esté en formato HH:mm
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Mostrar sugerencias solo para el campo título y cuando no es una receta predefinida
        if (name === 'title' && !recipeName) {
            if (value.trim()) { // Mostrar sugerencias si hay texto
                const searchTerm = value.toLowerCase();
                const filteredSuggestions = categoryMeals.filter(meal => 
                    meal.nombre_receta.toLowerCase().includes(searchTerm)
                );
                console.log('Sugerencias encontradas:', filteredSuggestions); // Para debugging
                setSuggestions(filteredSuggestions);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.timeFrom || !formData.timeTo) {
            setAlert({
                show: true,
                message: 'Por favor completa todos los campos',
                type: 'error'
            });
            return;
        }

        try {
            const selectedDate = new Date(formData.date + 'T00:00:00');
            
            const finalData = {
                title: formData.title.trim(),
                day: selectedDate.getDate(),
                month: selectedDate.getMonth() + 1,
                year: selectedDate.getFullYear(),
                timeFrom: formatTime(formData.timeFrom),
                timeTo: formatTime(formData.timeTo)
            };

            console.log('Datos a enviar:', finalData);
            onSubmit(finalData);
        } catch (error) {
            console.error('Error en el formulario:', error);
            setAlert({
                show: true,
                message: 'Error al procesar los datos del formulario',
                type: 'error'
            });
        }
    };

    const handleSelectSuggestion = (selectedRecipe) => {
        setFormData(prev => ({
            ...prev,
            title: selectedRecipe.nombre_receta
        }));
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const getFormTitle = () => {
        if (isViewOnly) return 'Detalles de la Receta';
        if (isEditing) return 'Editar Receta';
        return recipeName ? `Agendar: ${recipeName}` : 'Agregar Receta';
    };

    return (
        <div className="event-form-overlay">
            <div className="event-form">
                <div className="event-form-header">
                    <h3>{getFormTitle()}</h3>
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
                                readOnly={isViewOnly || !!recipeName}
                                autoComplete="off"
                            />
                            {!isViewOnly && !recipeName && showSuggestions && suggestions.length > 0 && (
                                <div className="suggestions-list">
                                    {suggestions.map((recipe, idx) => (
                                        <div 
                                            key={recipe.id_receta || idx}
                                            className="suggestion-item"
                                            onClick={() => handleSelectSuggestion(recipe)}
                                        >
                                            {recipe.nombre_receta}
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
                            readOnly={isViewOnly}
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
                                readOnly={isViewOnly}
                                step="60"
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
                                readOnly={isViewOnly}
                                step="60"
                            />
                        </div>
                    </div>

                    {!isViewOnly && (
                        <button type="submit" className="submit-btn">
                            {isEditing ? 'Actualizar Receta' : 'Guardar Receta'}
                        </button>
                    )}
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
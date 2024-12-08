import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Alert from '../Alert/Alert';
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
    const cleanArrayData = (data) => {
        if (!data) return '';
        if (Array.isArray(data)) return data.join(', ');
        if (typeof data === 'string') {
            try {
                // Si es un string que parece un array JSON, intentar parsearlo
                if (data.startsWith('[')) {
                    const parsed = JSON.parse(data);
                    return Array.isArray(parsed) ? parsed.join(', ') : data;
                }
                return data;
            } catch (e) {
                return data;
            }
        }
        return '';
    };

    const [formData, setFormData] = useState(() => {
        if (initialData) {
            console.log('Initial Data recibido:', initialData);

            const eventDate = new Date(initialData.year, initialData.month - 1, initialData.day);
            console.log('Fecha creada:', eventDate);

            return {
                title: initialData.title,
                date: formatDateForInput(eventDate),
                timeFrom: initialData.timeFrom ? initialData.timeFrom.slice(0, 5) : '',
                timeTo: initialData.timeTo ? initialData.timeTo.slice(0, 5) : '',
                ingredients: cleanArrayData(initialData.ingredients),
                instructions: cleanArrayData(initialData.instructions)
            };
        }

        const initialDate = formatDateForInput(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)
        );
        
        return {
            title: recipeName || '',
            date: initialDate,
            timeFrom: '',
            timeTo: '',
            ingredients: '',
            instructions: ''
        };
    });

    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    function formatDateForInput(date) {
        try {
            const d = new Date(date);
            
            if (isNaN(d.getTime())) {
                console.error('Fecha inválida:', date);
                return new Date().toISOString().split('T')[0];
            }

            // Ajustar la fecha para la zona horaria local
            const offset = d.getTimezoneOffset();
            const adjustedDate = new Date(d.getTime() + (offset * 60 * 1000));

            let month = (adjustedDate.getMonth() + 1).toString();
            let day = adjustedDate.getDate().toString();
            const year = adjustedDate.getFullYear();

            month = month.padStart(2, '0');
            day = day.padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return new Date().toISOString().split('T')[0];
        }
    }

    const handleDateChange = (e) => {
        console.log('Nueva fecha seleccionada:', e.target.value);
        setFormData(prev => ({
            ...prev,
            date: e.target.value
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateObj = new Date(formData.date + 'T00:00:00');
        
        try {
            const eventData = {
                title: formData.title,
                day: dateObj.getDate(),
                month: dateObj.getMonth() + 1,
                year: dateObj.getFullYear(),
                timeFrom: formData.timeFrom,
                timeTo: formData.timeTo,
                ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
                instructions: formData.instructions.split('.').map(i => i.trim()).filter(Boolean)
            };

            console.log('Enviando datos:', eventData);
            
            if (isEditing && initialData?.id) {
                await onSubmit(initialData.id, eventData);
            } else {
                await onSubmit(eventData);
            }
            
            onClose();
        } catch (error) {
            console.error('Error en el formulario:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    return (
        <div className="event-form-overlay">
            <div className={`event-form ${isViewOnly ? 'view-mode' : ''}`}>
                <div className="event-form-header">
                    <h3>{isEditing ? 'Editar Receta' : 'Agendar Receta'}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <IoMdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Nombre de la Receta</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            readOnly={isViewOnly}
                        />
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

                    <div className="form-group">
                        <label htmlFor="ingredients">Ingredientes (separados por comas)</label>
                        <textarea
                            id="ingredients"
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                            placeholder="Ej: 2 papas, 3 huevos, 1 taza de arroz"
                            rows="3"
                            readOnly={isViewOnly}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="instructions">Instrucciones (separadas por puntos)</label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            placeholder="Ej: Pelar las papas. Hervir el agua. Cocinar por 20 minutos."
                            rows="4"
                            readOnly={isViewOnly}
                        />
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
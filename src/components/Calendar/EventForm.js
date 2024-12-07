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
    const [formData, setFormData] = useState(() => {
        if (initialData) {
            return {
                title: initialData.title,
                date: formatDateForInput(
                    new Date(initialData.year, initialData.month - 1, initialData.day)
                ),
                timeFrom: initialData.timeFrom,
                timeTo: initialData.timeTo,
                ingredients: initialData.ingredients || '',
                instructions: initialData.instructions || ''
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
                            placeholder="Ej: papa, huevo, aceite"
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
                            placeholder="Ej: Pelar las papas. Hervir el agua. Freír los huevos."
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
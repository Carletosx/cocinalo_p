import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Alert from '../Alert/Alert';

const EventForm = ({ selectedDate, currentDate, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        day: selectedDate,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        timeFrom: '',
        timeTo: ''
    });

    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar que todos los campos necesarios estén presentes
        if (!formData.title || !formData.timeFrom || !formData.timeTo) {
            setAlert({
                show: true,
                message: 'Por favor completa todos los campos',
                type: 'error'
            });
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="event-form-overlay">
            <div className="event-form">
                <div className="event-form-header">
                    <h3>Agregar Receta para el {selectedDate}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}</h3>
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
                            placeholder="Ingresa el nombre de la receta"
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
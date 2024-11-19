import React from 'react';
import './ConfirmDialog.scss';

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <div className="confirm-dialog-content">
                    <h3>Confirmar acción</h3>
                    <p>{message}</p>
                    <div className="confirm-dialog-buttons">
                        <button 
                            className="confirm-button"
                            onClick={onConfirm}
                        >
                            Eliminar
                        </button>
                        <button 
                            className="cancel-button"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog; 
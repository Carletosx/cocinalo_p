import React from 'react';
import './Alert.scss';
import { IoMdClose } from "react-icons/io";
import { MdErrorOutline, MdCheckCircleOutline, MdInfoOutline } from "react-icons/md";

const Alert = ({ message, type = 'error', onClose }) => {
  const getAlertTitle = () => {
    switch (type) {
      case 'success':
        return '¡Éxito!';
      case 'error':
        return '¡Error!';
      case 'info':
        return 'Información';
      default:
        return 'Aviso';
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheckCircleOutline size={32} />;
      case 'error':
        return <MdErrorOutline size={32} />;
      case 'info':
        return <MdInfoOutline size={32} />;
      default:
        return <MdInfoOutline size={32} />;
    }
  };

  return (
    <div className="alert-overlay">
      <div className={`alert alert-${type}`} role="alert" aria-live="polite">
        <div className="alert-icon">
          {getAlertIcon()}
        </div>
        <div className="alert-content">
          <h3>{getAlertTitle()}</h3>
          <p>{message}</p>
        </div>
        <button 
          className="alert-close" 
          onClick={onClose}
          aria-label="Cerrar alerta"
        >
          <IoMdClose size={28} />
        </button>
      </div>
    </div>
  );
};

export default Alert; 
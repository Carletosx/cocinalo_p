import axios from 'axios';

// Crear una instancia de axios con configuraciones predeterminadas
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Asegúrate que este puerto coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token a las peticiones
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Mejorar el manejo de errores
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

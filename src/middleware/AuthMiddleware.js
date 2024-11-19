import { Navigate, useLocation } from 'react-router-dom';

// Componente para rutas protegidas
export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
};

// Componente para rutas públicas
export const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    
    if (token) {
        return <Navigate to={location.state?.from?.pathname || '/'} replace />;
    }
    
    return children;
};

export const auth = {
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    login: (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export default auth;

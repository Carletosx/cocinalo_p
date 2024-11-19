export const handleApiError = (error) => {
    if (error.response) {
        // Error de respuesta del servidor
        switch (error.response.status) {
            case 400:
                return 'Datos inválidos. Por favor, verifica la información.';
            case 401:
                return 'Sesión expirada. Por favor, vuelve a iniciar sesión.';
            case 403:
                return 'No tienes permiso para realizar esta acción.';
            case 404:
                return 'Recurso no encontrado.';
            case 500:
                return 'Error en el servidor. Por favor, intenta más tarde.';
            default:
                return error.response.data?.message || 'Error desconocido.';
        }
    }
    
    if (error.request) {
        // Error de red
        return 'Error de conexión. Por favor, verifica tu conexión a internet.';
    }
    
    // Error de configuración
    return 'Error en la aplicación. Por favor, recarga la página.';
}; 
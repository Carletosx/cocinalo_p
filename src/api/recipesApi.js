// src/api/recipesApi.js
import axios from './axios'; // Importar la instancia de axios configurada

// Función para buscar recetas por nombre
export const searchRecipes = async (searchTerm) => {
  try {
    // Intentamos primero con la búsqueda exacta
    const response = await axios.get('/recipes/search', { 
      params: { name: searchTerm } 
    });

    // Si no hay resultados, intentamos buscar por palabras individuales
    if (!response.data || response.data.length === 0) {
      const words = searchTerm.toLowerCase().split(' ');
      
      // Intentamos con cada palabra individual
      for (const word of words) {
        const wordResponse = await axios.get('/recipes/search', { 
          params: { name: word } 
        });
        
        if (wordResponse.data && wordResponse.data.length > 0) {
          // Filtramos los resultados para asegurarnos que coincidan con la búsqueda completa
          const filteredResults = wordResponse.data.filter(recipe => 
            recipe.nombre_receta.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          if (filteredResults.length > 0) {
            return filteredResults;
          }
        }
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error al buscar recetas:', error);
    throw error;
  }
};

// Función para obtener todas las categorías
export const getCategories = async () => {
  try {
    const response = await axios.get('/recipes/categories');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

// Función para obtener los detalles de una receta por ID
export const getRecipeById = async (id) => {
  try {
    const response = await axios.get(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles de la receta:', error);
    throw error;
  }
};


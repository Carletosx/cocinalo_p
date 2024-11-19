// src/api/recipesApi.js
import axios from './axios'; // Importar la instancia de axios configurada

// Función para buscar recetas por nombre
export const searchRecipes = async (name) => {
  try {
    const response = await axios.get('/recipes/search', { params: { name } });
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


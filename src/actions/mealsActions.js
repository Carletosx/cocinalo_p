import axios from "../api/axios";
import {
    FETCH_CATEGORY_BEGIN,
    FETCH_CATEGORY_SUCCESS,
    FETCH_CATEGORY_ERROR,
    FETCH_CATEGORY_MEALS_BEGIN,
    FETCH_CATEGORY_MEALS_SUCCESS,
    FETCH_CATEGORY_MEALS_ERROR,
    FETCH_SINGLE_MEAL_BEGIN,
    FETCH_SINGLE_MEAL_SUCCESS,
    FETCH_SINGLE_MEAL_ERROR
} from "./actions";

export const startFetchCategories = async(dispatch) => {
    try {
        dispatch({ type: FETCH_CATEGORY_BEGIN });
        const response = await axios.get('/recipes/categories');
        console.log('Respuesta de categorías:', response.data);
        dispatch({ type: FETCH_CATEGORY_SUCCESS, payload: response.data });
    } catch(error) {
        console.error('Error al cargar categorías:', error);
        dispatch({ type: FETCH_CATEGORY_ERROR, payload: error.message });
    }
}

export const startFetchMealByCategory = async(dispatch, category) => {
    try {
        dispatch({ type: FETCH_CATEGORY_MEALS_BEGIN });
        const response = await axios.get(`/recipes/category/${category}`);
        console.log('Recetas por categoría:', response.data);
        
        dispatch({
            type: FETCH_CATEGORY_MEALS_SUCCESS,
            payload: response.data
        });
    } catch(error) {
        console.error('Error al cargar recetas por categoría:', error);
        dispatch({
            type: FETCH_CATEGORY_MEALS_ERROR,
            payload: error.message
        });
    }
}

export const startFetchSingleMeal = async(dispatch, id) => {
    try {
        dispatch({ type: FETCH_SINGLE_MEAL_BEGIN });
        const response = await axios.get(`/recipes/${id}`);
        console.log('Detalle de receta:', response.data);
        dispatch({ type: FETCH_SINGLE_MEAL_SUCCESS, payload: response.data });
    } catch(error) {
        console.error('Error al cargar receta:', error);
        dispatch({ type: FETCH_SINGLE_MEAL_ERROR, payload: error.message });
    }
}

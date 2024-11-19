import * as actions from '../actions/actions';

export const initialState = {
    // Categorías
    categories: [],
    categoryLoading: false,
    categoryError: null,

    // Recetas por categoría
    categoryMeals: [],
    categoryMealsLoading: false,
    categoryMealsError: null,

    // Receta individual
    meal: null,
    mealLoading: false,
    mealError: null,

    // Búsqueda
    searchResults: null,
    searchLoading: false,
    searchError: null,
    hasSearched: false
};

export function mealReducer(state = initialState, action) {
    switch (action.type) {
        // Categorías
        case actions.FETCH_CATEGORY_BEGIN:
            return {
                ...state,
                categoryLoading: true,
                categoryError: null
            };
        case actions.FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                categoryLoading: false,
                categories: action.payload
            };
        case actions.FETCH_CATEGORY_ERROR:
            return {
                ...state,
                categoryLoading: false,
                categoryError: action.payload
            };

        // Recetas por categoría
        case actions.FETCH_CATEGORY_MEALS_BEGIN:
            return {
                ...state,
                categoryMealsLoading: true,
                categoryMealsError: null
            };
        case actions.FETCH_CATEGORY_MEALS_SUCCESS:
            return {
                ...state,
                categoryMealsLoading: false,
                categoryMeals: action.payload
            };
        case actions.FETCH_CATEGORY_MEALS_ERROR:
            return {
                ...state,
                categoryMealsLoading: false,
                categoryMealsError: action.payload
            };

        // Receta individual
        case actions.FETCH_SINGLE_MEAL_BEGIN:
            return {
                ...state,
                mealLoading: true,
                mealError: null
            };
        case actions.FETCH_SINGLE_MEAL_SUCCESS:
            return {
                ...state,
                mealLoading: false,
                meal: action.payload
            };
        case actions.FETCH_SINGLE_MEAL_ERROR:
            return {
                ...state,
                mealLoading: false,
                mealError: action.payload
            };

        // Búsqueda y limpieza
        case actions.SET_SEARCH_RESULTS:
            return {
                ...state,
                searchResults: action.payload,
                hasSearched: true
            };
        case actions.CLEAR_MEALS:
            return {
                ...state,
                categoryMeals: [],
                meal: null,
                searchResults: null,
                hasSearched: false,
                categoryMealsError: null,
                mealError: null,
                searchError: null
            };

        default:
            return state;
    }
}

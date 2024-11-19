import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { mealReducer, initialState } from "../reducers/mealReducer";
import { startFetchCategories, startFetchMealByCategory, startFetchSingleMeal } from "../actions/mealsActions";

const MealContext = createContext();

export const MealProvider = ({ children }) => {
    const [state, dispatch] = useReducer(mealReducer, initialState);

    // Cargar categorías al inicio
    useEffect(() => {
        startFetchCategories(dispatch);
    }, []);

    // Funciones memoizadas
    const fetchMealsByCategory = useCallback(async (category) => {
        await startFetchMealByCategory(dispatch, category);
    }, []);

    const fetchSingleMeal = useCallback(async (id) => {
        await startFetchSingleMeal(dispatch, id);
    }, []);

    const clearMeals = useCallback(() => {
        dispatch({ type: 'CLEAR_MEALS' });
    }, []);

    const setSearchResults = useCallback((results) => {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
    }, []);

    const value = {
        ...state,
        dispatch,
        fetchMealsByCategory,
        fetchSingleMeal,
        clearMeals,
        setSearchResults
    };

    return (
        <MealContext.Provider value={value}>
            {children}
        </MealContext.Provider>
    );
};

export const useMealContext = () => {
    const context = useContext(MealContext);
    if (!context) {
        throw new Error('useMealContext debe usarse dentro de un MealProvider');
    }
    return context;
};


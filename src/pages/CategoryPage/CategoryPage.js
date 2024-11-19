import React, { useEffect, useState } from 'react';
import "./CategoryPage.scss";
import { useMealContext } from '../../context/mealContext';
import MealList from '../../components/Meal/MealList';
import Loader from '../../components/Loader/Loader';
import { useParams } from 'react-router-dom';
import { startFetchMealByCategory } from '../../actions/mealsActions';

const CategoryPage = () => {
  const { name } = useParams();
  const { 
    categoryMeals, 
    dispatch, 
    categories,
    categoryMealsLoading,
    categoryMealsError 
  } = useMealContext();
  const [categoryDescription, setCategoryDescription] = useState("");

  // Efecto para obtener la descripción de la categoría
  useEffect(() => {
    if (categories && categories.length > 0) {
      const category = categories.find(cat => cat.nombre_categoria === name);
      setCategoryDescription(category?.descripcion || "");
    }
  }, [categories, name]);

  // Efecto para cargar las recetas de la categoría
  useEffect(() => {
    const loadCategoryMeals = async () => {
      if (name) {
        try {
          await startFetchMealByCategory(dispatch, name);
        } catch (error) {
          console.error('Error al cargar las recetas:', error);
        }
      }
    };

    loadCategoryMeals();
    
    // Limpiar las recetas al desmontar
    return () => {
      dispatch({ type: 'CLEAR_CATEGORY_MEALS' });
    };
  }, [name, dispatch]);

  if (categoryMealsLoading) {
    return (
      <main className='main-content py-5'>
        <div className='container'>
          <Loader />
        </div>
      </main>
    );
  }

  if (categoryMealsError) {
    return (
      <main className='main-content py-5'>
        <div className='container'>
          <div className='error-message'>
            <p>Error al cargar las recetas: {categoryMealsError}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='main-content py-5'>
      <div className='container'>
        <div className='cat-description px-4 py-4'>
          <h2 className='text-orange fw-8'>{name}</h2>
          <p className='fs-18 op-07'>{categoryDescription}</p>
        </div>
        
        {!categoryMeals || categoryMeals.length === 0 ? (
          <div className='no-meals-message'>
            <p>No hay recetas disponibles en esta categoría.</p>
          </div>
        ) : (
          <MealList meals={categoryMeals} />
        )}
      </div>
    </main>
  );
}

export default CategoryPage;

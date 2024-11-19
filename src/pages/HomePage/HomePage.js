import React from 'react';
import "./HomePage.scss";
import CategoryList from "../../components/Category/CategoryList";
import { useMealContext } from '../../context/mealContext';
import Loader from '../../components/Loader/Loader';
import MealList from '../../components/Meal/MealList';

const HomePage = () => {
  const { categories, categoryLoading, searchResults } = useMealContext();

  return (
    <main className='main-content'>
      {searchResults && searchResults.length > 0 && <MealList meals={searchResults} />}
      
      {(!searchResults || searchResults.length === 0) && (
        <div className='categories-section'>
          {categoryLoading ? <Loader /> : <CategoryList categories={categories} />}
        </div>
      )}
    </main>
  );
}

export default HomePage;

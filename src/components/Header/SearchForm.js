import React, { useState } from 'react';
import { searchRecipes } from '../../api/recipesApi';
import "./Header.scss";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useMealContext } from '../../context/mealContext';
import Alert from '../Alert/Alert';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useMealContext();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const data = await searchRecipes(searchTerm);
      
      if (!data || data.length === 0) {
        setShowAlert(true);
        return;
      }

      dispatch({ type: 'SET_SEARCH_RESULTS', payload: data });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error al buscar recetas:', error);
      setShowAlert(true);
    }
  };

  return (
    <>
      <form className='search-form flex align-center' onSubmit={handleSearch}>
        <input
          type="text"
          className='form-control-input text-dark-gray fs-15'
          placeholder='Busca tu receta aquí ...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className='form-submit-btn text-white text-uppercase fs-14'>
          <BsSearch className='btn-icon' size={20} />
        </button>
      </form>

      {showAlert && (
        <Alert
          message={`No se encontraron recetas que coincidan con "${searchTerm}"`}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default SearchForm;

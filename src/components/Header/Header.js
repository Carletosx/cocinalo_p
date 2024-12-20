import React from 'react';
import "./Header.scss";
import Navbar from "./Navbar";
import SearchForm from "./SearchForm";

const Header = ({ showOnlyNavbar = false }) => {
  return (
    <header className={`header ${showOnlyNavbar ? 'navbar-only' : ''}`}>
      <Navbar />
      {!showOnlyNavbar && (
        <div className='header-content flex align-center justify-center flex-column text-center'>
          <SearchForm />
          <h1 className='text-white header-title ls-2'>¿Cuáles son tus Recetas favoritas?</h1>
          <p className='text-uppercase text-white my-3 ls-1'>Personaliza tu experiencia</p>
        </div>
      )}
    </header>
  )
}

export default Header
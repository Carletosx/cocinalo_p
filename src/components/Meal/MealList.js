import React from 'react';
import "./Meal.scss";
import { Link } from 'react-router-dom';
import { BiTime } from 'react-icons/bi';
import { MdOutlineFoodBank } from 'react-icons/md';

const MealList = ({ meals }) => {
  console.log('Meals en MealList:', meals);

  if (!meals || meals.length === 0) {
    return (
      <div className='section-wrapper'>
        <div className='container'>
          <div className='sc-title'>Recetas</div>
          <div className='meals-empty'>
            <MdOutlineFoodBank size={48} />
            <p>No se encontraron recetas en esta categoría.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='section-wrapper'>
      <div className='container'>
        <div className='sc-title'>Recetas</div>
        <section className='sc-meal grid'>
          {meals.map(mealItem => {
            const { 
              id_receta: id, 
              nombre_receta: nombre, 
              descripcion, 
              imagen_url: thumbnail, 
              tiempo_preparacion, 
              dificultad 
            } = mealItem;

            return (
              <Link to={`/meal/${id}`} className="meal-itm" key={id}>
                <div className='meal-itm-img'>
                  <img 
                    src={thumbnail} 
                    alt={nombre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-recipe.jpg';
                    }} 
                  />
                  <div 
                    className='meal-itm-cat bg-orange'
                    data-difficulty={dificultad}
                  >
                    {dificultad}
                  </div>
                </div>

                <div className='meal-itm-body'>
                  <div className='meal-itm-body-info'>
                    <h3 className='meal-title'>{nombre}</h3>
                    <div className='meal-info'>
                      <span className='prep-time'>
                        <BiTime className='icon' />
                        {tiempo_preparacion} mins
                      </span>
                      <span 
                        className='difficulty'
                        data-difficulty={dificultad}
                      >
                        {dificultad}
                      </span>
                    </div>
                    <p className='meal-description'>{
                      descripcion?.length > 100 
                        ? `${descripcion.substring(0, 100)}...` 
                        : descripcion
                    }</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div> 
  );
}

export default MealList;

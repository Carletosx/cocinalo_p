import React from 'react';
import { Link } from 'react-router-dom';
import "./Category.scss";

const CategoryList = ({ categories }) => {
  console.log('Categories en CategoryList:', categories);

  if (!categories || categories.length === 0) {
    return (
      <div className='section-wrapper bg-whitesmoke'>
        <div className='container'>
          <div className='sc-title'>Categorías</div>
          <div className='categories-empty'>
            <p>No hay categorías disponibles en este momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='section-wrapper bg-whitesmoke'>
      <div className='container'>
        <div className='sc-title'>Categorías</div>
        <section className='sc-category grid'>
          {categories.map(category => {
            const { 
              id_categoria: id, 
              nombre_categoria: title, 
              imagen_url: thumbnail,
              descripcion 
            } = category;

            return (
              <Link 
                to={`/meal/category/${title}`} 
                className="category-itm align-center justify-center" 
                key={id}
                title={descripcion}
              >
                <div className='category-itm-img h-100 w-100 flex align-center justify-center'>
                  {thumbnail ? (
                    <img 
                      src={thumbnail} 
                      alt={title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-category.jpg';
                      }}
                    />
                  ) : (
                    <div className="category-placeholder">
                      <span>{title[0]}</span>
                    </div>
                  )}
                  <div className='category-itm-title bg-orange'>
                    <h3 className='text-white fs-11 fw-6 ls-1 text-uppercase'>{title}</h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default CategoryList;

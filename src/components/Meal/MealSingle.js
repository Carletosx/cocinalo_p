import React from 'react';
import "./Meal.scss";
import { AiFillHome, AiOutlineCheckSquare } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BiChevronsRight } from "react-icons/bi";

const MealSingle = ({ meal }) => {
  if (!meal || Object.keys(meal).length === 0) {
    return <div>No se encontraron datos de la receta.</div>;
  }

  // Dividir y limpiar los ingredientes y las instrucciones
  const ingredients = meal.ingredientes ? meal.ingredientes.split(',').map(ing => ing.trim()) : [];
  const instructions = meal.instrucciones ? meal.instrucciones.split('.').filter(inst => inst.trim().length > 0) : [];

  return (
    <div className='section-wrapper'>
      <div className='container'>
        <div className='breadcrumb bg-orange text-white'>
          <ul className='flex align-center my-2'>
            <li className='breadcrumb-item'>
              <Link to="/" className='flex align-center'>
                <AiFillHome size={22} />
              </Link>
            </li>
            <li className='flex align-center mx-1'>
              <BiChevronsRight size={23} />
            </li>
            <li className='breadcrumb-item flex'>
              <span className='fs-15 fw-5 text-uppercase'>{meal.nombre_receta}</span>
            </li>
          </ul>
        </div>

        <div className='sc-title'>Detalles de la Receta</div>
        <section className='sc-details bg-white'>
          <div className='details-head grid'>
            <div className='details-img'>
              <img src={meal.imagen_url} alt={meal.nombre_receta} className='img-cover' />
            </div>

            <div className='details-intro'>
              <h3 className='title text-orange'>{meal.nombre_receta}</h3>
              <div className='py-4'>
                <div className='category flex align-center'>
                  <span className='text-uppercase fw-8 ls-1 my-1'>Categoría: &nbsp;</span>
                  <span className='text-uppercase ls-2'>{meal.nombre_categoria}</span>
                </div>

                <div className='difficulty flex align-center'>
                  <span className='fw-7'>Dificultad: &nbsp;</span>
                  <span>{meal.dificultad || 'No especificada'}</span>
                </div>
              </div>

              <div className='ingredients my-5 px-3 py-3'>
                <h6 className='fs-16 text-white'>Ingredientes</h6>
                <ul className='grid'>
                  {ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex align-center">
                      <span className='li-dot'>{idx + 1}</span>
                      <span className='text-capitalize text-white fs-15'>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='details-body'>
            <div className='instructions my-4'>
              <h6 className='fs-16'>Instrucciones:</h6>
              <ul className='grid'>
                {instructions.map((instruction, idx) => (
                  <li key={idx} className="fs-14">
                    <AiOutlineCheckSquare size={18} className="text-orange li-icon" />
                    <span className='li-text fs-16 fw-5 op-09'>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MealSingle;
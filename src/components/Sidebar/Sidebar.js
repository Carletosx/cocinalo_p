import React from 'react';
import { useSidebarContext } from '../../context/sidebarContext';
import { ImCancelCircle} from "react-icons/im";
import "./Sidebar.scss";
import { Link } from "react-router-dom";
import { useMealContext } from '../../context/mealContext';

const Sidebar = () => {
    const { isSidebarOpen, closeSidebar} = useSidebarContext();
    const { categories } = useMealContext();

    console.log('Categories en Sidebar:', categories);

    return (
        <nav className={`sidebar ${isSidebarOpen ? 'sidebar-visible' : ""}`}>
            <button type="button" className='navbar-hide-btn' onClick={closeSidebar}>
                <ImCancelCircle size={24} />
            </button>

            <div className='side-content'>
                <ul className='side-nav'>
                    {categories && categories.map(category => (
                        <li className='side-item' key={category.id_categoria}>
                            <Link 
                                to={`/meal/category/${category.nombre_categoria}`} 
                                className='side-link ls-1 fs-13' 
                                onClick={closeSidebar}
                            >
                                {category.nombre_categoria}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default Sidebar;

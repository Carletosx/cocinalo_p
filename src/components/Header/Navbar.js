import React from 'react';
import { Link } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { useSidebarContext } from '../../context/sidebarContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { openSidebar } = useSidebarContext();
    const { user, logout } = useAuth();

    return (
        <nav className='navbar'>
            <div className='container'>
                <div className='navbar-content flex align-center justify-between'>
                    <div className='nav-left flex align-center'>
                        <button type="button" className='sidebar-show-btn' onClick={openSidebar}>
                            <IoMenu size={30} />
                        </button>
                    </div>

                    <div className='nav-center'>
                        <Link to="/" className='navbar-brand'>
                            <span>COCINALO</span>
                        </Link>
                    </div>

                    <div className='nav-right'>
                        {user ? (
                            <div className='user-actions flex align-center'>
                                <Link to="/calendar" className='nav-link'>
                                    Calendario
                                </Link>
                                <span className='user-name'>
                                    Hola, {user.nombre}
                                </span>
                                <button onClick={logout} className='nav-link btn-logout'>
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <div className='auth-buttons flex align-center'>
                                <Link to="/login" className='nav-link'>
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className='nav-link btn-register'>
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
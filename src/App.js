import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MealProvider } from './context/mealContext';
import { SidebarProvider } from './context/sidebarContext';
import { ProtectedRoute, PublicRoute } from './middleware/AuthMiddleware';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import { Home, Error, MealDetails, Category, CalendarPage } from './pages';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

function App() {
    return (
        <AuthProvider>
            <MealProvider>
                <SidebarProvider>
                    <BrowserRouter>
                        <div className='main-holder'>
                            <Header />
                            <Sidebar />
                            <main className='main-content'>
                                <Routes>
                                    {/* Rutas públicas */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/meal/:id" element={<MealDetails />} />
                                    <Route path="/meal/category/:name" element={<Category />} />

                                    {/* Rutas de autenticación */}
                                    <Route 
                                        path="/login" 
                                        element={
                                            <PublicRoute>
                                                <LoginForm />
                                            </PublicRoute>
                                        } 
                                    />
                                    <Route 
                                        path="/register" 
                                        element={
                                            <PublicRoute>
                                                <RegisterForm />
                                            </PublicRoute>
                                        } 
                                    />

                                    {/* Rutas protegidas */}
                                    <Route 
                                        path="/calendar" 
                                        element={
                                            <ProtectedRoute>
                                                <CalendarPage />
                                            </ProtectedRoute>
                                        } 
                                    />

                                    <Route path="*" element={<Error />} />
                                </Routes>
                            </main>
                        </div>
                    </BrowserRouter>
                </SidebarProvider>
            </MealProvider>
        </AuthProvider>
    );
}

export default App;

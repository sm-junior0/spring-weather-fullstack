import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import WeatherList from './components/WeatherList';
import CityList from './components/CityList';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Navbar: React.FC = () => {
    const { logout, user } = useAuth();
    const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : '';

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Weather
                        </Link>
                        <Link to="/cities" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Cities
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {firstLetter && (
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                                {firstLetter}
                            </div>
                        )}
                        <button
                            onClick={logout}
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="min-h-screen bg-gray-100">
            {isAuthenticated && !isAuthPage && <Navbar />}
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate to="/" /> : <Login />
                    } />
                    <Route path="/register" element={
                        isAuthenticated ? <Navigate to="/" /> : <Register />
                    } />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <WeatherList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/cities"
                        element={
                            <PrivateRoute>
                                <CityList />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;

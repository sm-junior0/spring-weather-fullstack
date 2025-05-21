import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import WeatherList from './components/WeatherList';
import CityList from './components/CityList';
import './App.css'

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-md">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex space-x-4">
                                <Link
                                    to="/"
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Cities
                                </Link>
                                <Link
                                    to="/weather"
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Weather
                                </Link>
                            </div>
                            <div className="flex space-x-4">
                                {isAuthenticated ? (
                                    <button
                                        onClick={logout}
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <main>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <div className="container mx-auto px-4 py-8">
                                        <WeatherList />
                                        <CityList />
                                    </div>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/weather"
                            element={
                                <PrivateRoute>
                                    <div className="container mx-auto px-4 py-8">
                                        <WeatherList />
                                    </div>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;

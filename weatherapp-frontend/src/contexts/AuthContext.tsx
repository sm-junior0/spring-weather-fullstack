import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../utils/axios';

interface AuthContextType {
    isAuthenticated: boolean;
    user: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setIsAuthenticated(true);
            setUser(username);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            });
            const { token, username: responseUsername } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', responseUsername);
            setIsAuthenticated(true);
            setUser(responseUsername);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await api.post('/auth/register', {
                username,
                email,
                password,
            });
            const { token, username: responseUsername } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', responseUsername);
            setIsAuthenticated(true);
            setUser(responseUsername);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}; 
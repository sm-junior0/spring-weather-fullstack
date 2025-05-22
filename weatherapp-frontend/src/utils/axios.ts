import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the token to every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Debug log
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request headers:', config.headers); // Debug log
            console.log('Request URL:', config.url); // Debug log
            console.log('Request method:', config.method); // Debug log
        } else {
            console.warn('No token found in localStorage'); // Debug log
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error); // Debug log
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging and handling auth errors
instance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status, response.config.url); // Debug log
        return response;
    },
    (error) => {
        console.log('Response error:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
        });

        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            
            // Redirect to login page if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default instance; 
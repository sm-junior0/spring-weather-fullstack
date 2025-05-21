import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Debug log
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request headers:', config.headers); // Debug log
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('Response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api; 
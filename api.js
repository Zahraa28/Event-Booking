import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('API URL:', API_URL);

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 seconds timeout
});

// Add request interceptor to add auth token
API.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
API.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            code: error.code
        });

        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Request timeout. Please try again.'));
        }
        if (!error.response) {
            return Promise.reject(new Error(`Network error. Please check if the server is running at ${API_URL}`));
        }
        return Promise.reject(error);
    }
);

export default API; 
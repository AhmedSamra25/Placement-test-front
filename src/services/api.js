import axios from 'axios';

// Initialize the Axios instance configured for the hosted backend
const api = axios.create({
    baseURL: 'https://placement-test-jyuu.onrender.com/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor to attach the Authorization token
api.interceptors.request.use((config) => {
    // We store the token generated from Laravel Sanctum under 'sg_auth_token' in localStorage
    const token = localStorage.getItem('sg_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle localized authorization failures
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        // If we receive unauthorized globally, we could clear local storage
        // localStorage.removeItem('sg_auth_token');
        // window.location.href = '/org/login'; 
    }
    return Promise.reject(error);
});

export default api;

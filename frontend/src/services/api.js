import axios from 'axios';

import { API_BASE_URL } from '../handlers/apiHandlers';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Feedback API calls
export const feedbackApi = {
    getAll: () => api.get('/feedback'),
    create: (data) => api.post('/feedback', data),
};

// Ratings API calls
export const ratingsApi = {
    getAll: () => api.get('/ratings'),
    create: (data) => api.post('/ratings', data),
};

// Reports API calls
export const reportsApi = {
    getAll: () => api.get('/reports'),
    getQuizPerformance: () => api.get('/reports/quiz-performance'),
    getSystemMetrics: () => api.get('/reports/system-metrics'),
};

// Users API calls
export const usersApi = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.patch(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Auth API calls
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
};

export default api;

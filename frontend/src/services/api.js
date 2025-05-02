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
    getAll: () => api.get('/rating/user'),
    getAllForSet: (setCode) => api.get(`/rating/set/${setCode}`),
    create: (data) => api.post('/rating', data),
};

// Reports API calls (Complaints)
export const reportsApi = {
    getAll: () => api.get('/report/user'),
    getAllForSet: (setCode) => api.get(`/report/set/${setCode}`),
    create: (data) => api.post('/report', data),
};

// Users API calls (via admin)
export const usersApi = {
    getAll: () => api.get('/admin/users'),
    getById: (id) => api.get(`/admin/users/${id}`),
    update: (id, data) => api.patch(`/admin/users/${id}`),
    delete: (id) => api.delete(`/admin/users/${id}`),
};

// Auth API calls
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
};

export default api;

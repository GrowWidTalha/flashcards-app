import axios from 'axios';
import { API_BASE_URL } from '../handlers/apiHandlers';

// Get all sets
export const getAllSets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sets`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sets:', error);
        throw error;
    }
};

// Get set by code
export const getSetByCode = async (setCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sets/${setCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching set ${setCode}:`, error);
        throw error;
    }
};

// Get sets by module
export const getSetsByModule = async (moduleCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sets/module/${moduleCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching sets for module ${moduleCode}:`, error);
        throw error;
    }
};

// Search sets by code or keywords
export const searchSets = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sets/search`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching sets:', error);
        throw error;
    }
};

// Create a new set
export const createSet = async (setData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/sets`, setData);
        return response.data;
    } catch (error) {
        console.error('Error creating set:', error);
        throw error;
    }
};

// Update a set
export const updateSet = async (setCode, setData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/sets/${setCode}`, setData);
        return response.data;
    } catch (error) {
        console.error(`Error updating set ${setCode}:`, error);
        throw error;
    }
};

// Delete a set
export const deleteSet = async (setCode) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/sets/${setCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting set ${setCode}:`, error);
        throw error;
    }
};

// Get user's studied sets with details
export const getUserStudiedSets = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/user/studied-sets`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user studied sets:', error);
        throw error;
    }
};

// Get recommended sets based on user's history
export const getRecommendedSets = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/sets/recommended`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recommended sets:', error);
        throw error;
    }
};

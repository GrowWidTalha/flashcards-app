import axios from 'axios';
import { API_BASE_URL } from '../handlers/apiHandlers';

// Get user profile
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_BASE_URL}/user/profile`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

// Get user's favorite sets
export const getUserFavorites = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/user/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user favorites:', error);
        throw error;
    }
};

// Add a set to favorites
export const addToFavorites = async (setCode) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/user/favorites`, { setCode }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
    }
};

// Remove a set from favorites
export const removeFromFavorites = async (setCode) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_BASE_URL}/user/favorites/${setCode}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
    }
};

export default {
    getUserProfile,
    updateUserProfile,
    getUserFavorites,
    addToFavorites,
    removeFromFavorites
};

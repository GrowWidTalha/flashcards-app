import api from './api';

const BASE_URL = '/rating';

// Create a new rating
export const createRating = async (setCode, overallRating, difficultyRating) => {
    try {
        const response = await api.post(BASE_URL, {
            setCode,
            overallRating,
            difficultyRating
        });
        return response.data;
    } catch (error) {
        console.error('Error creating rating:', error);
        throw error;
    }
};

// Get all ratings for a specific set
export const getRatingsForSet = async (setCode) => {
    try {
        const response = await api.get(`${BASE_URL}/set/${setCode}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching set ratings:', error);
        throw error;
    }
};

// Get all ratings by the current user
export const getUserRatings = async () => {
    try {
        const response = await api.get(`${BASE_URL}/user`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user ratings:', error);
        throw error;
    }
};

import api from './api';

const BASE_URL = '/quiz-attempts';

// Record an answer
export const recordAnswer = async (setId, setCode, questionId, questionText, userAnswer, correctAnswer) => {
    try {
        const response = await api.post(`${BASE_URL}/record-answer`, {
            setId,
            setCode,
            questionId,
            questionText,
            userAnswer,
            correctAnswer
        });
        return response.data;
    } catch (error) {
        console.error('Error recording answer:', error);
        throw error;
    }
};

// Complete a quiz attempt
export const completeAttempt = async (attemptId) => {
    try {
        const response = await api.post(`${BASE_URL}/complete`, { attemptId });
        return response.data;
    } catch (error) {
        console.error('Error completing attempt:', error);
        throw error;
    }
};

// Get all attempts for the current user
export const getUserAttempts = async () => {
    try {
        const response = await api.get(`${BASE_URL}/user-attempts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user attempts:', error);
        throw error;
    }
};

// Get attempts for a specific set
export const getSetAttempts = async (setId) => {
    try {
        const response = await api.get(`${BASE_URL}/set-attempts/${setId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching set attempts:', error);
        throw error;
    }
};

// Get details for a specific attempt
export const getAttemptDetails = async (attemptId) => {
    try {
        const response = await api.get(`${BASE_URL}/attempt/${attemptId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching attempt details:', error);
        throw error;
    }
};

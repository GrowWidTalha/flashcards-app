import axios from 'axios';
import { API_BASE_URL } from '../handlers/apiHandlers';

// Get all questions
export const getAllQuestions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

// Get questions by set code
export const getQuestionsBySet = async (setCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions/set/${setCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching questions for set ${setCode}:`, error);
        throw error;
    }
};

// Get questions by module code
export const getQuestionsByModule = async (moduleCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions/module/${moduleCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching questions for module ${moduleCode}:`, error);
        throw error;
    }
};

// Create a new question
export const createQuestion = async (questionData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/questions`, questionData);
        return response.data;
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
};

// Update a question
export const updateQuestion = async (questionId, questionData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/questions/${questionId}`, questionData);
        return response.data;
    } catch (error) {
        console.error(`Error updating question ${questionId}:`, error);
        throw error;
    }
};

// Delete a question
export const deleteQuestion = async (questionId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/questions/${questionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting question ${questionId}:`, error);
        throw error;
    }
};

// Upload user questions
export const uploadUserQuestions = async (questions, moduleCode, setCode, order) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/questions/upload`, {
            questions,
            moduleCode,
            setCode,
            order
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading questions:', error);
        throw error;
    }
};

// Submit user answer
export const submitUserAnswer = async (setCode, questionId, userAnswer) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/questions/answer`, {
            setCode,
            questionId,
            userAnswer
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting answer:', error);
        throw error;
    }
};

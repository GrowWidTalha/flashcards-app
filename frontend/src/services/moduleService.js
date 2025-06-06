import axios from 'axios';
import { API_BASE_URL } from '../handlers/apiHandlers';


// Get all modules
export const getAllModules = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/modules`);
        return response.data;
    } catch (error) {
        console.error('Error fetching modules:', error);
        throw error;
    }
};

// Get module by code
export const getModuleByCode = async (moduleCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/modules/${moduleCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching module ${moduleCode}:`, error);
        throw error;
    }
};

// Create a new module
export const createModule = async (moduleData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/modules`, moduleData);
        return response.data;
    } catch (error) {
        console.error('Error creating module:', error);
        throw error;
    }
};

// Update a module
export const updateModule = async (moduleCode, moduleData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/modules/${moduleCode}`, moduleData);
        return response.data;
    } catch (error) {
        console.error(`Error updating module ${moduleCode}:`, error);
        throw error;
    }
};

// Delete a module
export const deleteModule = async (moduleCode) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/modules/${moduleCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting module ${moduleCode}:`, error);
        throw error;
    }
};

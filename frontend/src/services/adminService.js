import axios from 'axios';
import * as XLSX from 'xlsx';
import { validateRequiredColumns, validateSetOrder, validateCharacterLimits, validateRequiredFields, processExcelData } from '../utils/fileValidation';
import { API_BASE_URL } from '../handlers/apiHandlers';

// Helper function to read Excel file
const readExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(firstSheet);
                resolve(rows);
            } catch (error) {
                reject(new Error('Error reading Excel file: ' + error.message));
            }
        };
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsArrayBuffer(file);
    });
};

// Get all questions with metadata
export const getAdminQuestions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/questions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin questions:', error);
        throw error;
    }
};

// Add new questions with validation
export const addAdminQuestions = async (questions) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/questions`, { questions });
        return response.data;
    } catch (error) {
        console.error('Error adding admin questions:', error);
        throw error;
    }
};

// Replace all questions with validation
export const replaceAdminQuestions = async (questions) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/admin/questions`, { questions });
        return response.data;
    } catch (error) {
        console.error('Error replacing admin questions:', error);
        throw error;
    }
};

// Upload Excel file with validation
export const uploadExcelFile = async (file) => {
    try {
        // Read and validate the Excel file
        const data = await readExcelFile(file);

        // Process the data using our validation utilities
        const { modules, questions } = processExcelData(data);

        // Replace all existing questions with the new data
        const response = await replaceAdminQuestions(questions);
        return response;
    } catch (error) {
        console.error('Error uploading Excel file:', error);
        throw error;
    }
};

// Download questions as CSV
export const downloadQuestionsCSV = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/questions/export`, {
            responseType: 'blob'
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `flashcards_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading CSV:', error);
        throw error;
    }
};

import * as XLSX from 'xlsx';
import axios from 'axios';
import { processExcelData } from '../utils/fileValidation';
import { API_BASE_URL } from '../handlers/apiHandlers';

// Read Excel file and return JSON data
export const readExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            } catch (error) {
                reject(new Error('Error reading Excel file: ' + error.message));
            }
        };

        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsArrayBuffer(file);
    });
};

// Upload Excel file with validation
export const uploadExcelFile = async (rawData) => {
    try {
        // Process the data using our validation utilities
        const { modules, questions } = processExcelData(rawData);

        // Upload questions for each module and set
        const results = {
            modulesCreated: 0,
            setsCreated: 0,
            questionsCreated: 0
        };

        for (const module of modules) {
            for (const set of module.sets) {
                // Filter questions for this specific set
                const setQuestions = questions.filter(q =>
                    q.moduleCode === module.module &&
                    q.setCode === set.setCode
                );

                // Upload questions for this set
                const response = await axios.post(`${API_BASE_URL}/questions/upload`, {
                    questions: setQuestions,
                    moduleCode: module.module,
                    setCode: set.setCode,
                    order: set.setOrder.toString()
                });

                // Update results
                results.questionsCreated += setQuestions.length;
                results.modulesCreated++;
                results.setsCreated++;
            }
        }

        return { results };
    } catch (error) {
        console.error('Error uploading Excel file:', error);
        throw error;
    }
};

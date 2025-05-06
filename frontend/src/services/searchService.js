import axios from 'axios';
import { API_BASE_URL } from "../handlers/apiHandlers"

export const searchContent = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sets/search`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching content:', error);
        throw error;
    }
};

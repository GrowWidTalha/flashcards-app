import axios from "axios";

// export const API_BASE_URL = "http://localhost:5000/api";
// const API_BASE_URL_LOCAL = "http://localhost:5000/api";
export const API_BASE_URL = "https://flashcards-app-backend.vercel.app/api";
const API_BASE_URL_LOCAL = "https://flashcards-app-backend.vercel.app/api";

export const fetchAllQuestions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

export const fetchAllAdminQuestions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL_LOCAL}/admin/questions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

export const fetchSet = async (setCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions/${setCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching set ${setCode}:`, error);
        throw error;
    }
};

export const uploadQuestions = async (questions) => {
    try {
        await axios.post(`${API_BASE_URL}/upload`, { questions });
    } catch (error) {
        console.error("Error uploading questions:", error);
        throw error;
    }
};

export const uploadAdminQuestions = async (questions) => {
    try {
        await axios.post(`${API_BASE_URL_LOCAL}/admin/upload`, { questions });
    } catch (error) {
        console.error("Error uploading questions:", error);
        throw error;
    }
};

export const uploadAdminReplaceQuestions = async (questions) => {
    try {
        await axios.post(`${API_BASE_URL_LOCAL}/admin/replaced`, { questions });
    } catch (error) {
        console.error("Error uploading questions:", error);
        throw error;
    }
};

export const fetchRecommendations = async (studiedSets, favorites) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recommendations`, {
            params: {
                studiedSets: studiedSets.join(","),
                favorites: favorites.join(","),
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    }
};

export const registerProgress = async (setCode, questionCount) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_BASE_URL}/progress/record`,
            {
                setCode,
                questionCount
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error registering progress:', error);
        throw error;
    }
};

export const fetchRecentProgress = async () => {
    try {
        const response = await fetch(API_BASE_URL + "/progress/recent", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch recent progress");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching recent progress:", error);
        return [];
    }
}

export const recordQuestionFeedback = async (rating, difficulty, setCode) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_BASE_URL}/progress/record`,
            {
                rating,
                difficulty,
                setCode
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error recording feedback:', error);
        throw error;
    }
};

export const addReport = async (qualityRating, message, setCode) => {
    try {
        const response = fetch(API_BASE_URL + "/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                setCode: setCode,
                qualityRating: qualityRating,
                message: message
            })
        })
        return response
    } catch (error) {
        console.error("Error fetching recommendations:", error);
    }
}

export const addQuestionComment = async (setCode, questionId, commentText) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_BASE_URL}/comments/add`,
            {
                setCode,
                questionId,
                commentText
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const getQuestionComments = async (setCode, questionId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_BASE_URL}/comments/question/${setCode}/${questionId}`,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error getting comments:', error);
        throw error;
    }
};

export const submitAndCheckAnswer = async (setCode, questionId, userAnswer) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_BASE_URL}/questions/answer`,
            {
                setCode,
                questionId,
                userAnswer
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting answer:', error);
        throw error;
    }
};

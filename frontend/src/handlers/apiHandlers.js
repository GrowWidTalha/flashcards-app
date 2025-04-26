import axios from "axios";

export const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL_LOCAL = "http://localhost:5000/api";
// export const API_BASE_URL = "https://flashcards-app-backend.vercel.app/api";
// const API_BASE_URL_LOCAL = "https://flashcards-app-backend.vercel.app/api";

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
        const response = fetch(API_BASE_URL + "/progress/record", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ setCode: setCode, questionCount: questionCount })
        });

    } catch (error) {
        console.error("Error fetching recommendations:", error);
    }
}

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

export const recordQuestionFeedback = async (overallRating, difficultyRating, setCode) => {
    try {
        const response = fetch(API_BASE_URL + "/rating", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                setCode: setCode,
                overallRating: overallRating,
                difficultyRating: difficultyRating,
            })
        })
        return response
    } catch (error) {
        console.error("Error fetching recommendations:", error);
    }
}

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

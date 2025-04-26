import React, { useState, useEffect } from 'react';
import { feedbackApi } from '../services/api';

const Feedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await feedbackApi.getAll();
                setFeedback(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch feedback');
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Submitted Feedback</h1>
            <div className="grid gap-4">
                {feedback.map((item) => (
                    <div key={item._id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">{item.userName}</h3>
                                <p className="text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-yellow-500">
                                {'★'.repeat(item.rating)}
                            </div>
                        </div>
                        <p className="text-gray-700">{item.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feedback;

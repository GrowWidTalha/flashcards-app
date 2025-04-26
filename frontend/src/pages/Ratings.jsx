import React, { useState, useEffect } from 'react';
import { ratingsApi } from '../services/api';

const Ratings = () => {
    const [ratings, setRatings] = useState([]);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await ratingsApi.getAll();
                setRatings(response.data.ratings);
                setStats(response.data.stats);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch ratings');
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Ratings Overview</h1>

            {/* Statistics Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Average Rating</h3>
                        <p className="text-2xl text-yellow-500">{stats.averageRating.toFixed(1)}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Total Ratings</h3>
                        <p className="text-2xl">{stats.totalRatings}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Rating Distribution</h3>
                        <div className="flex justify-center space-x-2">
                            {Object.entries(stats.ratingDistribution).map(([rating, count]) => (
                                <div key={rating} className="text-center">
                                    <p className="text-yellow-500">{'★'.repeat(rating)}</p>
                                    <p>{count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Ratings */}
            <h2 className="text-2xl font-bold mb-4">Recent Ratings</h2>
            <div className="grid gap-4">
                {ratings.map((rating) => (
                    <div key={rating._id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold">{rating.userName}</h3>
                                <p className="text-gray-600">{new Date(rating.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-yellow-500">
                                {'★'.repeat(rating.value)}
                            </div>
                        </div>
                        {rating.comment && (
                            <p className="mt-2 text-gray-700">{rating.comment}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ratings;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MySetsScreen from './mysetsscreen';
import { getUserStudiedSets, getRecommendedSets } from '../services/setService';
import { getUserFavorites } from '../services/userService';
import LoadingScreen from '../components/LoadingScreen';

const MySetsPage = () => {
    const navigate = useNavigate();
    const [recentSetsWithDetails, setRecentSetsWithDetails] = useState([]);
    const [recommendedSets, setRecommendedSets] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMySets, setShowMySets] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch user's recently studied sets
                const studiedSetsData = await getUserStudiedSets();
                setRecentSetsWithDetails(studiedSetsData || []);

                // Fetch recommended sets
                const recommendedSetsData = await getRecommendedSets();
                setRecommendedSets(recommendedSetsData || []);

                // Fetch user's favorites
                const favoritesData = await getUserFavorites();
                setFavorites(favoritesData || []);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLoadSet = (setCode) => {
        // Navigate to the quiz page with the selected set
        navigate(`/module/${setCode}`);
    };

    const handleReturnToMenu = () => {
        navigate('/');
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (!showMySets) {
        navigate('/');
        return null;
    }

    return (
        <MySetsScreen
            studiedSets={recentSetsWithDetails}
            recommendedSets={recommendedSets}
            onLoadSet={handleLoadSet}
            favorites={favorites}
            onReturnToMenu={() => setShowMySets(false)}
        />
    );
};

export default MySetsPage;

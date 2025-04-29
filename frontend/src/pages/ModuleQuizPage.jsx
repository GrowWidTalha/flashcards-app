import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleByCode } from '../services/moduleService';
import { getSetByCode } from '../services/setService';
import { registerProgress, recordQuestionFeedback } from '../handlers/apiHandlers';
import QuizScreen from '../components/QuizScreen';
import LoadingScreen from '../components/LoadingScreen';
import '../components/ModuleSet.css';

const ModuleQuizPage = () => {
    const { moduleCode } = useParams();
    const navigate = useNavigate();

    const [module, setModule] = useState(null);
    const [sets, setSets] = useState([]);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingSet, setLoadingSet] = useState(false);
    const [error, setError] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showSetInfo, setShowSetInfo] = useState(false);
    const [completedSets, setCompletedSets] = useState([]);
    const [showSetRating, setShowSetRating] = useState(false);
    const [setRating, setSetRating] = useState(0);
    const [savingRating, setSavingRating] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    // Fetch module and its sets
    useEffect(() => {
        const fetchModuleData = async () => {
            try {
                setLoading(true);
                const data = await getModuleByCode(moduleCode);

                if (!data || !data.module) {
                    setError('Module not found');
                    return;
                }

                setModule(data.module);

                // Sort sets by order
                const sortedSets = [...data.sets].sort((a, b) => a.setOrder - b.setOrder);
                setSets(sortedSets);

                // Set initial completion state
                setCompletedSets(new Array(sortedSets.length).fill(false));

                setLoading(false);

                // If we have sets, load the first one
                if (sortedSets.length > 0) {
                    loadSet(sortedSets[0].setCode, 0);
                }
            } catch (err) {
                setError('Failed to load module data. Please try again later.');
                console.error('Error fetching module:', err);
                setLoading(false);
            }
        };

        fetchModuleData();
    }, [moduleCode]);

    // Load a specific set
    const loadSet = async (setCode, index) => {
        try {
            setLoadingSet(true);
            const data = await getSetByCode(setCode);

            if (!data || !data.set) {
                setError(`Set ${setCode} not found`);
                return;
            }

            setCurrentSet({
                ...data.set,
                questions: data.questions
            });

            setQuestions(data.questions);
            setCurrentSetIndex(index);
            setCurrentQuestionIndex(0);
            setShowAnswer(false);
            setShowSetRating(false);
            setLoadingSet(false);
        } catch (err) {
            setError(`Failed to load set ${setCode}. Please try again later.`);
            console.error('Error fetching set:', err);
            setLoadingSet(false);
        }
    };

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const handleToggleFavorite = (setCode) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(setCode)) {
                return prevFavorites.filter(code => code !== setCode);
            } else {
                return [...prevFavorites, setCode];
            }
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowAnswer(false);
        } else if (currentQuestionIndex === questions.length - 1) {
            // Last question - register progress
            registerProgress(currentSet.setCode, questions.length);

            // Mark this set as completed
            const newCompletedSets = [...completedSets];
            newCompletedSets[currentSetIndex] = true;
            setCompletedSets(newCompletedSets);

            // Show rating UI
            setShowSetRating(true);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setShowAnswer(false);
        }
    };

    const handleToggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleReturnToMenu = () => {
        navigate('/');
    };

    const handleSetRating = async (rating) => {
        try {
            setSavingRating(true);
            setSetRating(rating);

            // Send rating to the backend
            await recordQuestionFeedback(
                rating, // overall rating
                Math.ceil(rating / 2), // difficulty rating (derived from overall)
                currentSet.setCode
            );

            setSavingRating(false);
        } catch (error) {
            console.error('Error saving rating:', error);
            setSavingRating(false);
            // Continue anyway to allow user to proceed
        }
    };

    const handleStartNextSet = () => {
        if (currentSetIndex < sets.length - 1) {
            loadSet(sets[currentSetIndex + 1].setCode, currentSetIndex + 1);
        }
    };

    if (loading) return <LoadingScreen />;

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')} className="btn btn-primary">
                    Return to Home
                </button>
            </div>
        );
    }

    // If we're loading a set
    if (loadingSet) return <LoadingScreen />;

    // If we have no sets or questions
    if (!currentSet || !questions || questions.length === 0) {
        return (
            <div className="no-questions-container">
                <h2>No Questions Available</h2>
                <p>This module does not contain any sets or questions.</p>
                <button onClick={handleReturnToMenu} className="btn btn-primary">
                    Return to Home
                </button>
            </div>
        );
    }

    // If showing set rating
    if (showSetRating) {
        return (
            <div className="module-quiz-container">
                <div className="sets-progress">
                    <h3>Module Progress</h3>
                    {sets.map((set, index) => (
                        <div
                            key={set.setCode}
                            className={`set-progress-item ${currentSetIndex === index ? 'active' : ''} ${completedSets[index] ? 'completed' : ''}`}
                        >
                            <span>{set.setName}</span>
                            <span>{completedSets[index] ? '✓ Completed' : 'Not started'}</span>
                        </div>
                    ))}
                </div>

                <div className="rating-container text-center p-4 bg-light rounded">
                    <h3>Rate this set: {currentSet.setName}</h3>
                    <div className="rating-stars my-4">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                className={`btn btn-lg ${setRating >= star ? 'btn-warning' : 'btn-outline-secondary'}`}
                                onClick={() => handleSetRating(star)}
                                disabled={savingRating}
                                style={{ margin: '0 10px', width: '60px', height: '60px' }}
                            >
                                {star}
                            </button>
                        ))}
                    </div>

                    {savingRating && <p>Saving your rating...</p>}

                    {setRating > 0 && currentSetIndex < sets.length - 1 && (
                        <button
                            className="btn btn-primary btn-lg mt-4"
                            onClick={handleStartNextSet}
                            disabled={savingRating}
                        >
                            Continue to Next Set
                        </button>
                    )}

                    {setRating > 0 && currentSetIndex === sets.length - 1 && (
                        <div>
                            <h4 className="mt-4">Congratulations! 🎉</h4>
                            <p>You've completed all sets in this module.</p>
                            <button
                                className="btn btn-success btn-lg mt-2"
                                onClick={handleReturnToMenu}
                                disabled={savingRating}
                            >
                                Return to Modules
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Normal quiz display
    return (
        <div className="module-quiz-container">

            <QuizScreen
                currentSet={currentSet}
                currentIndex={currentQuestionIndex}
                showAnswer={showAnswer}
                showSetInfo={showSetInfo}
                favorites={favorites}
                onToggleFavorite={() => handleToggleFavorite(currentSet.setCode)}
                onToggleSetInfo={() => setShowSetInfo(!showSetInfo)}
                onToggleAnswer={handleToggleAnswer}
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                onReturnToMenu={handleReturnToMenu}
            />
        </div>
    );
};

export default ModuleQuizPage;

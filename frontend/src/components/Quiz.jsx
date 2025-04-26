import React, { useState, useEffect } from "react";
import "./Quiz.css";
import LoadingScreen from "./LoadingScreen";
import QuizScreen from "./QuizScreen";
import SetSelectionScreen from "./SetSelectionScreen";
import MySetsScreen from "./MySetsScreen";
import UploadSetsPrompt from "./UploadSetsPrompt";
import { fetchAllQuestions, fetchRecentProgress } from "../handlers/apiHandlers";
import { organizeSets } from "../handlers/setHandlers";
import {
    loadSetHandler,
    loadRandomSetHandler,
    toggleFavoriteHandler,
    renderCategoryPath,
} from "../handlers/setHandlers";
import { handleFileUpload } from "../handlers/fileHandlers";
import {
    handleNextQuestion,
    handlePreviousQuestion,
    returnToMainMenu,
} from "../handlers/quizHandlers";

const Quiz = () => {
    const [allSets, setAllSets] = useState([]);
    const [currentSet, setCurrentSet] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [studiedSets, setStudiedSets] = useState([]);
    const [recommendedSets, setRecommendedSets] = useState([]);
    const [showSetInfo, setShowSetInfo] = useState(false);
    const [showMySets, setShowMySets] = useState(false);
    const [recentProgress, setRecentProgress] = useState([]);
    const [completedSetsCount, setCompletedSetsCount] = useState(() => {
        const saved = localStorage.getItem('completedSetsCount');
        return saved ? parseInt(saved) : 0;
    });
    const [showUploadPrompt, setShowUploadPrompt] = useState(false);

    // Fetch all sets on component mount
    useEffect(() => {
        const fetchAllSets = async () => {
            setLoading(true);
            try {
                const questions = await fetchAllQuestions();
                const organizedSets = organizeSets(questions);
                setAllSets(organizedSets);
            } catch (error) {
                console.error("Error fetching sets:", error);
                setAllSets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllSets();
    }, []);

    // Fetch recent progress when showing My Sets screen
    useEffect(() => {
        const loadRecentProgress = async () => {
            if (showMySets) {
                try {
                    const progress = await fetchRecentProgress();
                    setRecentProgress(progress);
                } catch (error) {
                    console.error("Error fetching recent progress:", error);
                }
            }
        };

        loadRecentProgress();
    }, [showMySets]);

    // Save completed sets count to localStorage
    useEffect(() => {
        localStorage.setItem('completedSetsCount', completedSetsCount.toString());
    }, [completedSetsCount]);

    // Handle set completion
    const handleSetCompletion = () => {
        const newCount = completedSetsCount + 1;
        setCompletedSetsCount(newCount);

        // Show upload prompt every 5 completed sets
        if (newCount % 5 === 0) {
            setShowUploadPrompt(true);
        }
    };

    // Handle upload prompt actions
    const handleUploadPromptClose = () => {
        setShowUploadPrompt(false);
    };

    const handleUploadClick = () => {
        setShowUploadPrompt(false);
        // Trigger file upload modal or redirect to upload page
        setShowModal(true);
    };

    const handleLoadSet = (setCode) => {
        setShowMySets(false); // Hide MySets screen when loading a set
        loadSetHandler(
            setCode,
            allSets,
            setCurrentSet,
            setCurrentIndex,
            setShowAnswer,
            studiedSets,
            setStudiedSets,
            setLoading,
            setRecommendedSets,
            favorites
        );
    };

    // Find set details for progress records
    const getSetDetails = (setCode) => {
        return allSets.find(set => set.setCode === setCode) || {
            setName: `Set ${setCode}`,
            setDescription: "",
            questions: []
        };
    };

    // Combine progress with set details
    const recentSetsWithDetails = recentProgress.map(progress => ({
        ...getSetDetails(progress.setCode),
        timesPracticed: progress.timesPracticed,
        lastPracticed: progress.lastAttempted
    }));

    return (
        <div className="quiz-container">
            {/* Upload Sets Prompt Modal */}
            <UploadSetsPrompt
                show={showUploadPrompt}
                onHide={handleUploadPromptClose}
                onUploadClick={handleUploadClick}
            />

            {loading ? (
                <LoadingScreen />
            ) : showMySets ? (
                <MySetsScreen
                    studiedSets={recentSetsWithDetails}
                    recommendedSets={recommendedSets}
                    onLoadSet={handleLoadSet}
                    favorites={favorites}
                    onReturnToMenu={() => setShowMySets(false)}
                />
            ) : currentSet ? (
                <QuizScreen
                    currentSet={currentSet}
                    currentIndex={currentIndex}
                    showAnswer={showAnswer}
                    showSetInfo={showSetInfo}
                    favorites={favorites}
                    recommendedSets={recommendedSets}
                    showModal={showModal}
                    onToggleFavorite={(setCode) =>
                        toggleFavoriteHandler(setCode, favorites, setFavorites)
                    }
                    onToggleSetInfo={() => setShowSetInfo(!showSetInfo)}
                    onShowModal={() => setShowModal(true)}
                    onHideModal={() => setShowModal(false)}
                    onPrevious={() =>
                        handlePreviousQuestion(currentIndex, setCurrentIndex, setShowAnswer)
                    }
                    onNext={() =>
                        handleNextQuestion(
                            currentIndex,
                            setCurrentIndex,
                            showAnswer,
                            setShowAnswer,
                            currentSet
                        )
                    }
                    onReturnToMenu={() => {
                        returnToMainMenu(setCurrentSet, setCurrentIndex, setShowAnswer);
                        setShowMySets(false);
                    }}
                    onLoadSet={handleLoadSet}
                    onLoadRandomSet={() =>
                        loadRandomSetHandler(
                            allSets,
                            studiedSets,
                            loadSetHandler,
                            allSets,
                            setCurrentSet,
                            setCurrentIndex,
                            setShowAnswer,
                            studiedSets,
                            setStudiedSets,
                            setLoading,
                            setRecommendedSets,
                            favorites
                        )
                    }
                    onFileUpload={(e) =>
                        handleFileUpload(e.target.files[0], setLoading, fetchAllQuestions)
                    }
                    renderCategoryPath={() => renderCategoryPath(currentSet)}
                    onSetComplete={handleSetCompletion}
                />
            ) : (
                <SetSelectionScreen
                    allSets={allSets}
                    favorites={favorites}
                    onLoadSet={handleLoadSet}
                    onLoadRandomSet={() =>
                        loadRandomSetHandler(
                            allSets,
                            studiedSets,
                            loadSetHandler,
                            allSets,
                            setCurrentSet,
                            setCurrentIndex,
                            setShowAnswer,
                            studiedSets,
                            setStudiedSets,
                            setLoading,
                            setRecommendedSets,
                            favorites
                        )
                    }
                    onFileUpload={(e) =>
                        handleFileUpload(e.target.files[0], setLoading, fetchAllQuestions)
                    }
                    onShowMySets={() => setShowMySets(true)}
                />
            )}
        </div>
    );
};

export default Quiz;

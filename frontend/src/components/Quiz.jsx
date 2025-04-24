import React, { useState, useEffect } from "react";
import "./Quiz.css";
import LoadingScreen from "./LoadingScreen";
import QuizScreen from "./QuizScreen";
import SetSelectionScreen from "./SetSelectionScreen";
import { fetchAllQuestions } from "../handlers/apiHandlers";
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

    return (
        <div className="quiz-container">

            {loading ? (
                <LoadingScreen />
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
                    onReturnToMenu={() =>
                        returnToMainMenu(setCurrentSet, setCurrentIndex, setShowAnswer)
                    }
                    onLoadSet={(setCode) =>
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
                        )
                    }
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
                />
            ) : (
                <SetSelectionScreen
                    allSets={allSets}
                    favorites={favorites}
                    onLoadSet={(setCode) =>
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
                        )
                    }
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
                />
            )}
        </div>
    );
};

export default Quiz;

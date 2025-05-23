"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getModuleByCode } from "../services/moduleService"
import { getSetByCode } from "../services/setService"
import { recordAnswer, completeAttempt } from "../services/quizAttemptService"
import { createRating } from "../services/ratingService"
import QuizScreen from "../components/QuizScreen"
import LoadingScreen from "../components/LoadingScreen"
import "../components/ModuleSet.css"

const ModuleQuizPage = ({ type = "module" }) => {
    const { id } = useParams()
    const navigate = useNavigate()

    // State management
    const [module, setModule] = useState(null)
    const [sets, setSets] = useState([])
    const [currentSetIndex, setCurrentSetIndex] = useState(0)
    const [currentSet, setCurrentSet] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingSet, setLoadingSet] = useState(false)
    const [error, setError] = useState(null)
    const [showAnswer, setShowAnswer] = useState(false)
    const [showSetInfo, setShowSetInfo] = useState(false)
    const [completedSets, setCompletedSets] = useState([])
    const [showSetRating, setShowSetRating] = useState(false)
    const [setRating, setSetRating] = useState(0)
    const [savingRating, setSavingRating] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [userAnswer, setUserAnswer] = useState("")
    const [answerResult, setAnswerResult] = useState(null)
    const [savedAnswers, setSavedAnswers] = useState({})
    const [currentAttemptId, setCurrentAttemptId] = useState(null)

    // Fetch module/set data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                if (type === "module") {
                    const data = await getModuleByCode(id)

                    if (!data || !data.module) {
                        setError("Module not found")
                        return
                    }

                    setModule(data.module)

                    // Sort sets by order
                    const sortedSets = [...data.sets].sort((a, b) => a.setOrder - b.setOrder)
                    setSets(sortedSets)

                    // Set initial completion state
                    setCompletedSets(new Array(sortedSets.length).fill(false))

                    setLoading(false)

                    // If we have sets, load the first one
                    if (sortedSets.length > 0) {
                        loadSet(sortedSets[0].setCode, 0)
                    }
                } else {
                    // Direct set access
                    const data = await getSetByCode(id)

                    if (!data || !data.set) {
                        setError("Set not found")
                        return
                    }

                    // For direct set access, we only have one set
                    setSets([data.set])
                    setCompletedSets([false])
                    setModule({ moduleCode: data.set.moduleCode, moduleName: data.set.setGroup })

                    // Load the set directly
                    setCurrentSet({
                        ...data.set,
                        questions: data.questions,
                    })
                    setCurrentSetIndex(0)
                    setCurrentQuestionIndex(0)
                    setLoading(false)
                }
            } catch (err) {
                setError("Failed to load data. Please try again later.")
                console.error("Error fetching data:", err)
                setLoading(false)
            }
        }

        fetchData()
    }, [id, type])

    // Load a specific set
    const loadSet = useCallback(
        async (setCode, index) => {
            try {
                setLoadingSet(true)
                const data = await getSetByCode(setCode)

                if (!data || !data.set) {
                    setError(`Set ${setCode} not found`)
                    return
                }

                setCurrentSet({
                    ...data.set,
                    questions: data.questions,
                })

                setCurrentSetIndex(index)
                setCurrentQuestionIndex(0)
                setShowAnswer(false)
                setShowSetRating(false)
                setUserAnswer("")
                setAnswerResult(null)
                setSavedAnswers({})
                setCurrentAttemptId(null)
                setLoadingSet(false)
            } catch (err) {
                setError(`Failed to load set ${setCode}. Please try again later.`)
                console.error("Error fetching set:", err)
                setLoadingSet(false)
            }
        },
        [sets],
    )

    // Load a random set
    const loadRandomSet = useCallback(() => {
        if (sets.length === 0) return;
        const randomIndex = Math.floor(Math.random() * sets.length);
        const randomSet = sets[randomIndex];
        loadSet(randomSet.setCode, randomIndex);
    }, [sets, loadSet]);

    // Handle navigation to next question
    const handleNextQuestion = useCallback(() => {
        if (!showAnswer) {
            setShowAnswer(true)
        } else if (currentQuestionIndex < currentSet.questions.length - 1) {
            // Move to next question
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setShowAnswer(false);
            setAnswerResult(null);

            // Set user answer from saved answers if it exists
            const nextQuestion = currentSet.questions[nextIndex];
            const nextQuestionId = nextQuestion._id || `q_${nextIndex}`;
            const savedAnswer = savedAnswers[nextQuestionId] || "";
            setUserAnswer(savedAnswer);

        } else if (currentQuestionIndex === currentSet.questions.length - 1) {
            // Last question - complete the attempt and show rating UI
            if (currentAttemptId) {
                try {
                    completeAttempt(currentAttemptId)
                        .then(() => {
                            setShowSetRating(true);
                        })
                        .catch(err => {
                            console.error("Error completing quiz attempt:", err);
                            // Still show the rating UI even if there's an error
                            setShowSetRating(true);
                        });
                } catch (error) {
                    console.error("Error calling completeAttempt:", error);
                    // Still show the rating UI
                    setShowSetRating(true);
                }
            } else {
                setShowSetRating(true);
            }
        }
    }, [currentQuestionIndex, currentSet, showAnswer, savedAnswers, currentAttemptId])

    // Handle navigation to previous question
    const handlePreviousQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            // Move to previous question
            const prevIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(prevIndex);
            setShowAnswer(false);
            setAnswerResult(null);

            // Set user answer from saved answers if it exists
            const prevQuestion = currentSet.questions[prevIndex];
            const prevQuestionId = prevQuestion._id || `q_${prevIndex}`;
            const savedAnswer = savedAnswers[prevQuestionId] || "";
            setUserAnswer(savedAnswer);
        }
    }, [currentQuestionIndex, currentSet, savedAnswers])

    // Handle returning to menu
    const handleReturnToMenu = useCallback(() => {
        navigate("/")
    }, [navigate])

    // Handle set rating
    const handleSetRating = useCallback(
        async (rating) => {
            try {
                setSavingRating(true)
                setSetRating(rating)

                // Save rating to backend
                // Using difficultyRating same as overallRating for simplicity
                if (currentSet && currentSet.setCode) {
                    await createRating(currentSet.setCode, rating, rating)
                    console.log("Rating saved successfully")
                } else {
                    console.error("Cannot save rating: missing set information")
                }

                // Mark this set as completed
                const newCompletedSets = [...completedSets]
                newCompletedSets[currentSetIndex] = true
                setCompletedSets(newCompletedSets)

                setSavingRating(false)
            } catch (error) {
                console.error("Error saving rating:", error)
                setSavingRating(false)
                // Show error message to user
                alert("Failed to save your rating. Please try again.")
            }
        },
        [completedSets, currentSetIndex, currentSet]
    )

    // Handle starting next set
    const handleStartNextSet = useCallback(() => {
        if (currentSetIndex < sets.length - 1) {
            loadSet(sets[currentSetIndex + 1].setCode, currentSetIndex + 1)
        }
    }, [currentSetIndex, loadSet, sets])

    // Handle answer submission
    const handleSubmitAnswer = useCallback(() => {
        if (!userAnswer.trim() || !currentSet?.questions) return;

        // Get the current question and its ID/index
        const currentQuestion = currentSet.questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const questionId = currentQuestion._id || `q_${currentQuestionIndex}`;

        // Save this answer to our savedAnswers state
        setSavedAnswers(prev => ({
            ...prev,
            [questionId]: userAnswer
        }));

        // Set a simplified answer result
        setAnswerResult({
            userAnswer: userAnswer,
            correctAnswer: currentQuestion.answer
        });

        // Record the answer in the backend
        try {
            recordAnswer(
                currentSet._id,
                currentSet.setCode,
                questionId,
                currentQuestion.question,
                userAnswer,
                currentQuestion.answer
            )
                .then(response => {
                    // Save the attempt ID for completing later
                    if (response.attemptId) {
                        setCurrentAttemptId(response.attemptId);
                    }
                })
                .catch(err => {
                    console.error("Error recording answer:", err);
                    // Continue anyway since we don't want to block the user
                });
        } catch (err) {
            console.error("Error in recordAnswer call:", err);
            // Continue - don't block the user experience due to backend issues
        }

        // Show the correct answer
        setShowAnswer(true);
    }, [userAnswer, currentSet, currentQuestionIndex]);

    // Handle user answer change
    const handleUserAnswerChange = useCallback((e) => {
        setUserAnswer(e.target.value);
    }, []);

    if (loading) return <LoadingScreen />

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/")} className="btn btn-primary">
                    Return to Home
                </button>
            </div>
        )
    }

    // If we're loading a set
    if (loadingSet) return <LoadingScreen />

    // If we have no sets or questions
    if (!currentSet || !currentSet.questions || currentSet.questions.length === 0) {
        return (
            <div className="no-questions-container">
                <h2>No Questions Available</h2>
                <p>This module does not contain any sets or questions.</p>
                <button onClick={handleReturnToMenu} className="btn btn-primary">
                    Return to Home
                </button>
            </div>
        )
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
                            className={`set-progress-item ${currentSetIndex === index ? "active" : ""} ${completedSets[index] ? "completed" : ""}`}
                        >
                            <span>{set.setName}</span>
                            <span>{completedSets[index] ? "✓ Completed" : "Not started"}</span>
                        </div>
                    ))}
                </div>

                <div className="rating-container text-center p-4 bg-light rounded">
                    <h3>Rate this set: {currentSet.setName}</h3>
                    <div className="rating-stars my-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className={`btn btn-lg ${setRating >= star ? "btn-warning" : "btn-outline-secondary"}`}
                                onClick={() => handleSetRating(star)}
                                disabled={savingRating}
                                style={{ margin: "0 10px", width: "60px", height: "60px" }}
                            >
                                {star}
                            </button>
                        ))}
                    </div>

                    {savingRating && <p>Saving your rating...</p>}

                    {setRating > 0 && currentSetIndex < sets.length - 1 && (
                        <button className="btn btn-primary btn-lg mt-4" onClick={handleStartNextSet} disabled={savingRating}>
                            Continue to Next Set
                        </button>
                    )}

                    {setRating > 0 && currentSetIndex === sets.length - 1 && (
                        <div>
                            <h4 className="mt-4">Congratulations! 🎉</h4>
                            <p>You've completed all sets in this module.</p>
                            <button className="btn btn-success btn-lg mt-2" onClick={handleReturnToMenu} disabled={savingRating}>
                                Return to Modules
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Normal quiz display
    return (
        <div className="module-quiz-container">
            <QuizScreen
                onLoadSet={loadSet}
                onLoadRandomSet={loadRandomSet}
                currentSet={currentSet}
                currentIndex={currentQuestionIndex}
                showAnswer={showAnswer}
                showSetInfo={showSetInfo}
                showModal={showModal}
                loading={loading}
                onToggleSetInfo={() => setShowSetInfo(!showSetInfo)}
                onShowModal={() => setShowModal(true)}
                onHideModal={() => setShowModal(false)}
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                onReturnToMenu={handleReturnToMenu}
                userAnswer={userAnswer}
                answerResult={answerResult}
                onUserAnswerChange={handleUserAnswerChange}
                onSubmitAnswer={handleSubmitAnswer}
            />
        </div>
    )
}

export default ModuleQuizPage

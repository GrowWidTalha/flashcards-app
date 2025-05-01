"use client"

import { useState, useEffect } from "react"
import { Button, Modal, Spinner, Form } from "react-bootstrap"
import { FaHome, FaRandom, FaComment, FaArrowRight } from "react-icons/fa"
import FileUploadModal from "./FileUploadModel"
import {
    addReport,
    recordQuestionFeedback,
    registerProgress,
    addQuestionComment,
    getQuestionComments,
} from "../handlers/apiHandlers"
import "./QuizScreen.css"

const QuizScreen = ({
    currentSet,
    currentIndex,
    showAnswer,
    showSetInfo,
    favorites,
    showModal,
    loading,
    onToggleFavorite,
    onToggleSetInfo,
    onShowModal,
    onHideModal,
    onPrevious,
    onNext,
    onReturnToMenu,
    onLoadSet,
    onLoadRandomSet,
    renderCategoryPath,
    recommendedSets,
    onSetComplete,
    userAnswer,
    answerResult,
    onUserAnswerChange,
    onSubmitAnswer,
}) => {
    // State management
    const [isFinished, setIsFinished] = useState(false)
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
    const [showReport, setShowReport] = useState(false)
    const [showMoreInfo, setShowMoreInfo] = useState(false)


    // Reset user answer when question changes
    useEffect(() => {
        if (onUserAnswerChange) {
            onUserAnswerChange({ target: { value: "" } })
        }
    }, [currentIndex, onUserAnswerChange])

    // Handle set completion
    const handleFinish = async () => {
        try {
            await registerProgress(currentSet.setCode, currentSet.questions.length)
        } catch (error) {
            console.error("Error registering progress:", error)
        }
        setIsFinished(true)
        onSetComplete && onSetComplete()
    }

    // Handle feedback submission
    const handleSubmitFeedback = async ({ quality, difficulty }) => {
        try {
            await recordQuestionFeedback(quality, difficulty, currentSet.setCode)
        } catch (error) {
            console.error("Error recording feedback:", error)
        }
        setFeedbackSubmitted(true)
    }

    // Handle set restart
    const handleRestart = () => {
        console.log("Restarting set:", currentSet?._id || "undefined");
        if (currentSet && onLoadSet) {
            setIsFinished(false);
            setFeedbackSubmitted(false);
            onLoadSet(currentSet._id);
        } else {
            console.error("Cannot restart: missing currentSet or onLoadSet function");
        }
    }


    // Handle report submission
    const handleSubmitReport = async ({ reportRating, reportText }) => {
        try {
            await addReport(reportRating, reportText, currentSet.setCode)
        } catch (error) {
            console.error("Error submitting report:", error)
        }
    }

    // Render answer input or result
    const renderAnswerInput = () => {
        if (showAnswer) {
            return (
                <div className="answer-result-container mt-3">
                    {answerResult && (
                        <div className="answer-result">
                            <div className="user-answer mb-2">
                                <h5>Your Answer:</h5>
                                <p>{answerResult.userAnswer}</p>
                            </div>
                            <div className="correct-answer mb-2">
                                <h5>Correct Answer:</h5>
                                <p>{answerResult.correctAnswer}</p>
                            </div>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div className="answer-input-container mt-3">
                    <Form.Group>
                        <Form.Label>Your Answer:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={userAnswer}
                            onChange={onUserAnswerChange}
                            placeholder="Type your answer here..."
                        />
                    </Form.Group>
                </div>
            );
        }
    };

    // Feedback Screen Component
    const FeedbackScreen = ({ onSubmit }) => {
        const [quality, setQuality] = useState(0)
        const [difficulty, setDifficulty] = useState(0)

        return (
            <div className="finished-screen text-center p-4">
                <h2>QUESTION SET FINISHED</h2>
                <p>YOU FINISHED THIS SET, WELL DONE!!</p>

                <h5 className="mt-4">How would you rate its overall quality?</h5>
                <div className="d-flex justify-content-center my-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Button
                            key={n}
                            variant={quality === n ? "primary" : "outline-primary"}
                            className="mx-1"
                            onClick={() => setQuality(n)}
                        >
                            {n}
                        </Button>
                    ))}
                </div>

                <h5 className="mt-3">Rate Difficulty</h5>
                <div className="d-flex justify-content-center my-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Button
                            key={n}
                            variant={difficulty === n ? "primary" : "outline-primary"}
                            className="mx-1"
                            onClick={() => setDifficulty(n)}
                        >
                            {n}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="success"
                    disabled={quality === 0 || difficulty === 0}
                    onClick={() => onSubmit({ quality, difficulty })}
                    className="mt-3"
                >
                    Submit Rating
                </Button>
            </div>
        )
    }

    // Next Actions Screen Component
    const NextActionsScreen = ({ onRestart, onLoadSet, onLoadRandomSet, recommendedSets, onReturnToMenu, currentSet }) => {
        // Group sets by category
        const setsByCategory = {};
        recommendedSets?.forEach(set => {
            const category = set.category || 'Uncategorized';
            if (!setsByCategory[category]) {
                setsByCategory[category] = [];
            }
            setsByCategory[category].push(set);
        });

        // Get unique categories
        const categories = Object.keys(setsByCategory);

        return (
            <div className="finished-screen p-4">
                <div className="section-container current-section">
                    <div className="section-header">
                        <h2>CURRENT</h2>
                    </div>

                    <div className="category-modules-header">
                        <div className="category-label">CATEGORY</div>
                        <div className="modules-label">MODULES</div>
                    </div>

                    {/* Current Module Information */}
                    <div className="current-info mt-3">
                        <div
                            className="subcategory-item"
                            onClick={() => {
                                console.log("Clicking current set to restart");
                                if (onRestart) {
                                    onRestart();
                                }
                            }}
                        >
                            {currentSet?.category || "General"} - {currentSet?.setName}
                        </div>
                    </div>
                </div>

                <div className="section-container category-section">
                    <div className="category-label mb-3">CATEGORY</div>

                    {/* Display Available Categories */}
                    <div className="subcategories-list">
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <div key={index}>
                                    <div
                                        className="subcategory-item"
                                        onClick={() => {
                                            if (setsByCategory[category]?.length > 0) {
                                                onLoadSet(setsByCategory[category][0]._id);
                                            }
                                        }}
                                    >
                                        {category} ({setsByCategory[category].length})
                                    </div>

                                    {/* Show available sets in this category */}
                                    {index < 2 && setsByCategory[category]?.length > 0 && (
                                        <div className="sets-container mt-2 mb-3">
                                            {setsByCategory[category].slice(0, 3).map((set, idx) => (
                                                <div
                                                    key={idx}
                                                    className="set-item mb-2"
                                                    onClick={() => onLoadSet(set._id)}
                                                >
                                                    {set.setName} ({set.questions?.length || 0})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-sets-message">
                                No recommended sets available. Use the buttons below to restart the current set or try a random one.
                            </div>
                        )}
                    </div>

                    <div className="sorting-note">
                        (SORTED BY CATEGORY)
                        <div>CLICK ON ANY CATEGORY OR SET TO START</div>
                    </div>
                </div>

                <div className="section-container upcoming-section">
                    <div className="section-header">
                        <h2>UPCOMING</h2>
                    </div>

                    <ol className="upcoming-list">
                        <li>Economics/CIMA</li>
                        <li>Philosophy/General Knowledge</li>
                        <li>Pod Quiz/Monday Pod Quiz</li>
                    </ol>
                </div>

                <div className="actions-row">
                    <button
                        className="action-button restart-button"
                        onClick={() => {
                            console.log("Restarting current set");
                            if (onRestart) {
                                onRestart();
                            }
                        }}
                    >
                        Restart Current Set
                    </button>
                    <button
                        className="action-button random-button"
                        onClick={() => {
                            console.log("Loading random set");
                            if (onLoadRandomSet) {
                                onLoadRandomSet();
                            }
                        }}
                    >
                        <FaRandom className="me-2" />
                        Random Set
                    </button>
                </div>
            </div>
        )
    }

    // More Info Screen Component
    const MoreInfoScreen = () => {
        const currentQuestion = currentSet?.questions?.[currentIndex];

        return (
            <div className="quiz-container">
                <div className="quiz-card-container">
                    <div className="more-info-page">
                        <h2>Additional Information</h2>

                        <div className="question-section mb-4">
                            <h4>Question:</h4>
                            <p className="question-text">{currentQuestion?.question}</p>
                        </div>

                        <div className="answer-section mb-4">
                            <h4>Answer:</h4>
                            <p>{currentQuestion?.answer}</p>
                        </div>

                        <div className="more-info-section mb-4">
                            <h4>Additional Information:</h4>
                            <div className="more-info-content">
                                {currentQuestion?.moreInfo ? (
                                    <p>{currentQuestion.moreInfo}</p>
                                ) : (
                                    <p>No additional information available for this question.</p>
                                )}
                            </div>
                        </div>

                        <button
                            className="btn-previous"
                            onClick={() => setShowMoreInfo(false)}
                        >
                            Back to Question
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Report Modal Component
    const ReportModal = ({ show, onHide, onSubmit }) => {
        const [reportRating, setReportRating] = useState(0)
        const [reportText, setReportText] = useState("")

        const handleSubmit = () => {
            onSubmit({ reportRating, reportText })
            onHide()
        }

        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Improve / Add Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        We'd love to know how we can improve this question set! Please rate its quality and share any suggestions.
                    </p>
                    <Form.Group className="mb-3">
                        <Form.Label>Rate Overall Quality</Form.Label>
                        <div>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <Button
                                    key={n}
                                    variant={reportRating === n ? "primary" : "outline-primary"}
                                    className="me-1"
                                    onClick={() => setReportRating(n)}
                                >
                                    {n}
                                </Button>
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Any suggestions?</Form.Label>
                        <Form.Control as="textarea" rows={3} value={reportText} onChange={(e) => setReportText(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit Report
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    // If finished but not yet rated → show FeedbackScreen
    if (isFinished) {
        return !feedbackSubmitted ? (
            <FeedbackScreen onSubmit={handleSubmitFeedback} />
        ) : (
            <NextActionsScreen
                onRestart={handleRestart}
                onLoadSet={onLoadSet}
                onLoadRandomSet={onLoadRandomSet}
                recommendedSets={recommendedSets}
                onReturnToMenu={onReturnToMenu}
                currentSet={currentSet}
            />
        )
    }

    // Show More Info screen if requested
    if (showMoreInfo) {
        return <MoreInfoScreen />
    }

    // Normal quiz view
    return (
        <div className="quiz-container">
            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="primary" className="m-2" />
                    <p className="loading-text">Loading quiz data, please wait...</p>
                </div>
            ) : (
                <div className="quiz-card-container">
                    {currentSet?.questions?.length > 0 ? (
                        <>
                            {/* Question Header */}
                            <div className="question-header">
                                Question {currentIndex + 1} of {currentSet.questions.length}
                            </div>

                            {/* Question Text */}
                            <div className="question-text">{currentSet.questions[currentIndex].question}</div>

                            {/* Answer Input or Result */}
                            {renderAnswerInput()}

                            {/* Answer Display when shown */}
                            {showAnswer && !answerResult && (
                                <div className="answer-container">
                                    <div className="title">Answer:</div>
                                    <p>{currentSet.questions[currentIndex].answer}</p>
                                </div>
                            )}

                            {/* Tags and Serial Number */}
                            <div className="tags-container">
                                <span className="tag tag-category">{currentSet.setName}</span>
                                {currentSet.category && <span className="tag tag-primary">{currentSet.category}</span>}
                                {currentSet.subCategory1 && <span className="tag tag-primary">{currentSet.subCategory1}</span>}
                                {currentSet.subCategory2 && <span className="tag tag-primary">{currentSet.subCategory2}</span>}
                                {currentSet.serialNumber && <span className="serial-number">Serial: {currentSet.serialNumber}</span>}
                                <FaArrowRight className="arrow-icon" />
                            </div>

                            {/* Show Info link */}
                            {/* <a
                                href="#"
                                className="show-info"
                                onClick={(e) => {
                                    e.preventDefault()
                                    onToggleSetInfo()
                                }}
                            >
                                {showSetInfo ? "Hide Info" : "Show Info"}
                            </a> */}

                            {/* Action Buttons */}
                            <div className="buttons-container">
                                <div className="left-buttons">
                                    <button className="btn-report" onClick={() => setShowReport(true)}>
                                        Improve / Add Report
                                    </button>
                                    <button className="btn-previous" onClick={onPrevious} disabled={currentIndex === 0}>
                                        Previous
                                    </button>
                                </div>
                                <div className="right-buttons">
                                    {!showAnswer && !answerResult ? (
                                        <button
                                            className="btn-show-answer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onSubmitAnswer();
                                            }}
                                            disabled={!userAnswer?.trim()}
                                        >
                                            Submit Answer
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-show-answer"
                                            onClick={() => {
                                                if (showAnswer && currentIndex === currentSet?.questions?.length - 1) {
                                                    handleFinish()
                                                } else {
                                                    onNext()
                                                }
                                            }}
                                        >
                                            {currentIndex === currentSet?.questions?.length - 1
                                                ? "Finish Set"
                                                : "Next Question"}
                                        </button>
                                    )}
                                    <button
                                        className="btn-show-answer"
                                        onClick={() => setShowMoreInfo(true)}
                                        disabled={!showAnswer}
                                    >
                                        More Info
                                    </button>
                                </div>
                            </div>
                            {/* More Info button when answer is displayed */}
                            {/* Home Button */}
                            <div className="navigation-row">
                                <button className="home-icon" onClick={onReturnToMenu}>
                                    <FaHome />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-questions-message text-center my-5">
                            <h4>No Questions Available</h4>
                            <p>Please upload a file or select a different set</p>
                            <FileUploadModal onFileUpload={() => { }} />
                        </div>
                    )}
                </div>
            )}

            {/* External Modals */}
            <ReportModal show={showReport} onHide={() => setShowReport(false)} onSubmit={handleSubmitReport} />
        </div>
    )
}

export default QuizScreen

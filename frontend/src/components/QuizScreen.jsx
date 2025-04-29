import React, { useState, useEffect } from "react";
import {
    Badge,
    Button,
    Card,
    Modal,
    Spinner,
    Form,
} from "react-bootstrap";
import { FaBackward, FaHome, FaRandom, FaRegStar, FaStar, FaComment, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import FileUploadModal from "./FileUploadModel";
import { addReport, recordQuestionFeedback, registerProgress, addQuestionComment, getQuestionComments } from "../handlers/apiHandlers"
import axios from "axios"
import "./QuizScreen.css";

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
    const [isFinished, setIsFinished] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // Fetch comments whenever the current question changes
    useEffect(() => {
        if (currentSet?.questions?.length > 0 && currentIndex >= 0) {
            fetchComments();
        }
    }, [currentSet, currentIndex]);

    // Reset user answer when question changes
    useEffect(() => {
        setUserAnswer("");
    }, [currentIndex]);

    // Fetch comments for the current question
    const fetchComments = async () => {
        if (!currentSet?.questions?.[currentIndex]) return;

        try {
            setLoadingComments(true);
            const questionId = currentSet.questions[currentIndex].questionId || currentIndex;
            const data = await getQuestionComments(currentSet.setCode, questionId);
            setComments(data || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    // Called when user clicks "Finish Set"
    const handleFinish = () => {
        try {
            const response = registerProgress(currentSet.setCode, currentSet.questions.length)
        } catch (error) {
            console.error(error)
        }
        setIsFinished(true);
        onSetComplete && onSetComplete(); // Call onSetComplete when a set is finished
    }

    // Called after feedback screen
    const handleSubmitFeedback = ({ quality, difficulty }) => {
        try {
            const response = recordQuestionFeedback(quality, difficulty, currentSet.setCode)
            console.log("Feedback:", quality, difficulty);
        } catch (error) {
            console.error(error)
        }
        setFeedbackSubmitted(true);
    };

    // Called when user clicks "Restart this set" in NextActions
    const handleRestart = () => {
        onLoadSet(currentSet._id);
        setIsFinished(false);
        setFeedbackSubmitted(false);
    };

    // Handle adding a comment
    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            // Add comment to the API
            await addQuestionComment(
                currentSet.setCode,
                currentSet.questions[currentIndex].questionId || currentIndex,
                commentText
            );

            // Update local state
            const newComment = {
                id: Date.now(),
                text: commentText,
                date: new Date().toISOString(),
                user: "You" // This would be replaced with actual user info
            };

            setComments(prev => [...prev, newComment]);
            setCommentText("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    // === FEEDBACK SCREEN ===
    const FeedbackScreen = ({ onSubmit }) => {
        const [quality, setQuality] = useState(0);
        const [difficulty, setDifficulty] = useState(0);
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
        );
    };

    // === NEXT ACTIONS SCREEN ===
    const NextActionsScreen = ({
        onRestart,
        onLoadSet,
        onLoadRandomSet,
        recommendedSets,
    }) => {
        const similar = recommendedSets.slice(0, 3);
        const related = recommendedSets.slice(3, 6);
        const different = recommendedSets.slice(6, 9);

        return (
            <div className="finished-screen p-4">
                <h2 className="text-center">QUESTION SET FINISHED</h2>
                <p className="text-center">What do you want to do now?</p>

                <div className="my-4">
                    <h5>Restart this set</h5>
                    <Button onClick={onRestart}>Restart</Button>
                </div>

                <div className="my-4">
                    <h5>Practice a similar set</h5>
                    {similar.length > 0 ? (
                        similar.map((s) => (
                            <Button
                                key={s._id}
                                variant="outline-primary"
                                className="me-2 mb-2"
                                onClick={() => onLoadSet(s._id)}
                            >
                                {s.setName}
                                {s.rating ? ` (${s.rating})` : ""}
                            </Button>
                        ))
                    ) : (
                        <p>No similar sets available.</p>
                    )}
                </div>

                <div className="my-4">
                    <h5>Practice a related set</h5>
                    {related.length > 0 ? (
                        related.map((s) => (
                            <Button
                                key={s._id}
                                variant="outline-secondary"
                                className="me-2 mb-2"
                                onClick={() => onLoadSet(s._id)}
                            >
                                {s.setName}
                            </Button>
                        ))
                    ) : (
                        <p>No related sets available.</p>
                    )}
                </div>

                <div className="text-center mt-4 flex w-full gap-2">
                    <Button variant="secondary" onClick={() => onReturnToMenu()}>
                        <FaHome className="me-1" />
                        Main Menu
                    </Button>
                    <Button variant="outline-danger" onClick={onLoadRandomSet}>
                        <FaRandom className="me-1" />
                        Random Set
                    </Button>
                </div>
            </div>
        );
    };

    // === IMPROVE / ADD REPORT MODAL ===
    const RatingSelect = ({ label, value, onChange }) => (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <div>
                {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                        key={n}
                        variant={value === n ? "primary" : "outline-primary"}
                        className="me-1"
                        onClick={() => onChange(n)}
                    >
                        {n}
                    </Button>
                ))}
            </div>
        </Form.Group>
    );

    const SuggestionsForm = ({ value, onChange }) => (
        <Form.Group className="mb-3">
            <Form.Label>Any suggestions?</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </Form.Group>
    );

    const ReportModal = ({ show, onHide, onSubmit }) => {
        const [reportRating, setReportRating] = useState(0);
        const [reportText, setReportText] = useState("");

        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Improve / Add Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        We'd love to know how we can improve this question set! Please rate
                        its quality and share any suggestions.
                    </p>
                    <RatingSelect
                        label="Rate Overall Quality"
                        value={reportRating}
                        onChange={setReportRating}
                    />
                    <SuggestionsForm
                        value={reportText}
                        onChange={setReportText}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        disabled={reportRating === 0}
                        onClick={() => {
                            onSubmit({ reportRating, reportText });
                            onHide();
                        }}
                    >
                        Submit Report
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const CommentItem = ({ comment }) => (
        <div className="comment-item">
            <div className="comment-header">
                <strong>{comment.user || comment.username || 'Anonymous'}</strong>
                <small className="text-muted">
                    {new Date(comment.date || comment.createdAt).toLocaleString()}
                </small>
            </div>
            <p className="mb-0">{comment.text || comment.content}</p>
        </div>
    );

    // Add renderAnswerInput function inside the component
    const renderAnswerInput = () => {
        if (showAnswer) {
            // Show answer result
            return (
                <div className="answer-result-container mt-3">
                    {answerResult && (
                        <div className={`answer-result ${answerResult.correct ? 'correct' : answerResult.partiallyCorrect ? 'partially-correct' : 'incorrect'}`}>
                            <div className="user-answer mb-2">
                                <h5>Your Answer:</h5>
                                <p>{answerResult.userAnswer}</p>
                            </div>
                            <div className="correct-answer mb-2">
                                <h5>Correct Answer:</h5>
                                <p>{answerResult.correctAnswer}</p>
                            </div>
                            {answerResult.similarity < 100 && (
                                <div className="similarity mb-2">
                                    <p>Similarity: {Math.round(answerResult.similarity)}%</p>
                                </div>
                            )}
                            {answerResult.moreInfo && (
                                <div className="more-info mt-3">
                                    <h5>Additional Information:</h5>
                                    <p>{answerResult.moreInfo}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        } else {
            // Show answer input field
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
                    <Button
                        className="mt-2"
                        onClick={onSubmitAnswer}
                        disabled={!userAnswer?.trim()}
                    >
                        Submit Answer
                    </Button>
                </div>
            );
        }
    };

    // —————————————————————————————
    // 1) If finished but not yet rated → show FeedbackScreen
    // 2) If finished and rated      → show NextActionsScreen
    // 3) Otherwise show normal quiz
    if (isFinished) {
        return !feedbackSubmitted ? (
            <FeedbackScreen onSubmit={handleSubmitFeedback} />
        ) : (
            <NextActionsScreen
                onRestart={handleRestart}
                onLoadSet={onLoadSet}
                onLoadRandomSet={onLoadRandomSet}
                recommendedSets={recommendedSets}
            />
        );
    }

    // —————————————————————————————
    //  Normal quiz view
    return (
        <div className="quiz-container">
            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="primary" className="m-2" />
                    <p className="loading-text">
                        Loading quiz data, please wait...
                    </p>
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
                            <div className="question-text">
                                {currentSet.questions[currentIndex].question}
                            </div>

                            {/* User Answer Input (only when answer not shown) */}
                            {!showAnswer && (
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
                                    <Button
                                        className="mt-2"
                                        onClick={onSubmitAnswer}
                                        disabled={!userAnswer?.trim()}
                                    >
                                        Submit Answer
                                    </Button>
                                </div>
                            )}

                            {/* Answer Display */}
                            {showAnswer && (
                                <div className="answer-container">
                                    <div className="title">Answer:</div>
                                    <p>{currentSet.questions[currentIndex].answer}</p>
                                </div>
                            )}

                            {/* Tags and Serial Number */}
                            <div className="tags-container">
                                <span className="tag tag-category">{currentSet.setName}</span>
                                <span className="tag tag-primary">{currentSet.category || "Category"}</span>
                                <span className="tag tag-primary">{currentSet.subCategory1 || "Subcategory"}</span>
                                <span className="tag tag-primary">{currentSet.subCategory2 || "Level"}</span>
                                <span className="serial-number">Serial: {currentSet.serialNumber || "xxxx"}</span>
                                <FaArrowRight className="arrow-icon" />
                            </div>

                            {/* Show Info link */}
                            <a href="#" className="show-info" onClick={(e) => {
                                e.preventDefault();
                                onToggleSetInfo();
                            }}>
                                Show Info
                            </a>

                            {/* Action Buttons */}
                            <div className="buttons-row">
                                <button
                                    className="nav-button button-outline"
                                    onClick={() => setShowReport(true)}
                                >
                                    Improve / Add Report
                                </button>

                                <button
                                    className="nav-button button-secondary"
                                    onClick={onPrevious}
                                    disabled={currentIndex === 0}
                                >
                                    Previous
                                </button>

                                <button
                                    className="nav-button button-primary"
                                    onClick={() => {
                                        if (showAnswer && currentIndex === currentSet.questions.length - 1) {
                                            handleFinish();
                                        } else {
                                            onNext();
                                        }
                                    }}
                                >
                                    {showAnswer
                                        ? currentIndex === currentSet.questions.length - 1
                                            ? "Finish Set"
                                            : "Next Question"
                                        : "Show Answer"}
                                </button>
                            </div>

                            {/* Only show More Info button when answer is displayed */}
                            {showAnswer && (
                                <button
                                    className="nav-button button-primary more-info-container"
                                    onClick={onShowModal}
                                >
                                    More Info
                                </button>
                            )}

                            {/* Comments Section (only when answer is shown) */}
                            {showAnswer && showComments && (
                                <div className="comments-container">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5>
                                            <FaComment className="me-2" />
                                            Comments
                                        </h5>
                                        <Button
                                            variant="link"
                                            onClick={() => setShowComments(!showComments)}
                                        >
                                            Hide Comments
                                        </Button>
                                    </div>

                                    <div className="comments-list mb-3">
                                        {loadingComments ? (
                                            <div className="text-center py-3">
                                                <Spinner animation="border" size="sm" />
                                                <span className="ms-2">Loading comments...</span>
                                            </div>
                                        ) : comments.length > 0 ? (
                                            comments.map(comment => (
                                                <CommentItem key={comment.id} comment={comment} />
                                            ))
                                        ) : (
                                            <p className="text-muted">No comments yet. Be the first to comment!</p>
                                        )}
                                    </div>

                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Add a comment..."
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleAddComment}
                                        disabled={!commentText.trim()}
                                    >
                                        Post Comment
                                    </Button>
                                </div>
                            )}

                            {/* Show Comments button (only when answer is shown) */}
                            {showAnswer && !showComments && (
                                <Button
                                    variant="outline-secondary"
                                    className="mt-3 w-100"
                                    onClick={() => setShowComments(true)}
                                >
                                    <FaComment className="me-2" />
                                    Show Comments
                                </Button>
                            )}

                            {/* Home Button */}
                            <div className="navigation-row">
                                <button className="home-icon" onClick={onReturnToMenu}>
                                    <FaHome />
                                </button>
                            </div>

                            {/* Add this right after the question content */}
                            {!isFinished && !feedbackSubmitted && renderAnswerInput()}
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
            <Modal show={showModal} onHide={onHideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>More Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {currentSet?.questions?.[currentIndex]?.moreInfo ||
                            "No additional information available."}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ReportModal
                show={showReport}
                onHide={() => setShowReport(false)}
                onSubmit={(data) => {
                    try {
                        const response = addReport(data.reportRating, data.reportText, currentSet.setCode)
                    } catch (error) {
                        console.log(error)
                    }
                }}
            />
        </div>
    );
};

export default QuizScreen;

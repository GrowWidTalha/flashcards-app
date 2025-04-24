import React, { useState } from "react";
import {
    Badge,
    Button,
    Card,
    Modal,
    Spinner,
    Form,
} from "react-bootstrap";
import { FaBackward, FaHome, FaRandom, FaRegStar, FaStar } from "react-icons/fa";
import FileUploadModal from "./FileUploadModel";
import { addReport, recordQuestionFeedback, registerProgress } from "../handlers/apiHandlers"
import axios from "axios"

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
}) => {
    const [isFinished, setIsFinished] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [showReport, setShowReport] = useState(false);

    // Called when user clicks “Finish Set”
    const handleFinish = () => {
        try {
            const response = registerProgress(currentSet.setCode, currentSet.questions.length)
        } catch (error) {
            console.error(error)
        }
        setIsFinished(true);

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

    // Called when user clicks “Restart this set” in NextActions
    const handleRestart = () => {

        onLoadSet(currentSet._id);
        setIsFinished(false);
        setFeedbackSubmitted(false);
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
                        We’d love to know how we can improve this question set! Please rate
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
    console.log(currentSet)
    return (
        <div className="">
            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="primary" className="m-2" />
                    <p className="loading-text">
                        Loading quiz data, please wait...
                    </p>
                </div>
            ) : (
                <div className="quiz-card">
                    {/* Top Bar */}
                    <div className="top-bar d-flex justify-content-between align-items-center">
                        <h3>{currentSet?.setName || "No Set Loaded"}</h3>
                        {currentSet && (
                            <Button
                                variant="link"
                                onClick={onToggleSetInfo}
                            >
                                {showSetInfo ? "Hide Info" : "Show Info"}
                            </Button>
                        )}
                    </div>

                    {/* Set Info */}
                    {showSetInfo && currentSet && (
                        <div className="set-details mb-3">
                            <p>
                                <strong>Description:</strong>{" "}
                                {currentSet.setDescription}
                            </p>
                            <p>
                                <strong>Category:</strong>{" "}
                                {renderCategoryPath()}
                            </p>
                            <p>
                                <strong>Set Code:</strong> {currentSet.setCode}
                            </p>
                            <Button
                                variant={
                                    favorites.includes(currentSet.setCode)
                                        ? "warning"
                                        : "outline-warning"
                                }
                                size="sm"
                                onClick={() =>
                                    onToggleFavorite(currentSet.setCode)
                                }
                                className="me-2"
                            >
                                {favorites.includes(currentSet.setCode) ? (
                                    <FaStar />
                                ) : (
                                    <FaRegStar />
                                )}
                                {favorites.includes(currentSet.setCode)
                                    ? " Favorited"
                                    : " Add to Favorites"}
                            </Button>
                        </div>
                    )}

                    {/* Question / Answer */}
                    {currentSet?.questions?.length > 0 ? (
                        <>
                            <div className="question-container mb-3">
                                <p className="fw-bold">
                                    Question {currentIndex + 1} of{" "}
                                    {currentSet.questions.length}
                                </p>
                                <p>
                                    {currentSet.questions[currentIndex].question}
                                </p>
                            </div>

                            {showAnswer && (
                                <div className="answer-container mb-3">
                                    <p className="fw-bold">Answer:</p>
                                    <p>
                                        {currentSet.questions[currentIndex].answer}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-questions-message text-center my-5">
                            <h4>No Questions Available</h4>
                            <p>Please upload a file or select a different set</p>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="mb-3">
                        <Badge bg="light" text="dark" pill className="me-1">
                            {currentSet?.setCode}
                        </Badge>
                        {[
                            currentSet?.category,
                            currentSet?.subCategory1,
                            currentSet?.subCategory2,
                            currentSet?.subCategory3,
                            currentSet?.subCategory4,
                        ]
                            .filter(Boolean)
                            .map((cat, i) => (
                                <Badge key={i} bg="info" className="me-1">
                                    {cat}
                                </Badge>
                            ))}
                    </div>

                    {/* Navigation */}
                    <div className="d-flex justify-content-between mb-3">
                        <Button
                            variant="secondary"
                            onClick={onPrevious}
                            disabled={
                                currentIndex === 0 ||
                                !currentSet?.questions?.length
                            }
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowReport(true)}
                        >
                            Improve / Add Report
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => {
                                if (
                                    showAnswer &&
                                    currentIndex ===
                                    currentSet.questions.length - 1
                                ) {
                                    handleFinish();
                                } else {
                                    onNext();
                                }
                            }}
                            disabled={!currentSet?.questions?.length}
                        >
                            {showAnswer
                                ? currentIndex ===
                                    currentSet.questions.length - 1
                                    ? "Finish Set"
                                    : "Next Question"
                                : "Show Answer"}
                        </Button>
                    </div>

                    {/* More Info */}
                    <div className="flex gap-2" >
                        <Button variant="secondary" onClick={() => onReturnToMenu()}>
                            <FaHome />
                        </Button>
                        <Button
                            variant="primary"
                            onClick={onShowModal}
                            className="w-full"
                        >
                            More Info
                        </Button>
                    </div>

                    {/* File Upload (if no questions) */}
                    {!currentSet?.questions?.length && (
                        <FileUploadModal onFileUpload={() => { }} />
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

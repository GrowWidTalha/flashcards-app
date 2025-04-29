import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSetByCode } from '../services/setService';
import { getQuestionsBySet } from '../services/questionService';
import { registerProgress, submitAndCheckAnswer } from '../handlers/apiHandlers';
import QuizScreen from '../components/QuizScreen';
import LoadingScreen from '../components/LoadingScreen';
import '../components/QuizScreen.css';

const QuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [currentSet, setCurrentSet] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showSetInfo, setShowSetInfo] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [answerResult, setAnswerResult] = useState(null);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchSetAndQuestions = async () => {
            try {
                setLoading(true);

                // Get set data
                const setData = await getSetByCode(quizId);
                setCurrentSet({
                    ...setData.set,
                    questions: setData.questions
                });
                setQuestions(setData.questions);

                // Reset quiz state
                setCurrentIndex(0);
                setShowAnswer(false);
                setUserAnswer('');
                setAnswerResult(null);
            } catch (err) {
                setError('Failed to load quiz. Please try again later.');
                console.error('Error fetching quiz data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSetAndQuestions();
    }, [quizId]);

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

    const handleUserAnswerChange = (e) => {
        setUserAnswer(e.target.value);
    };

    const handleSubmitAnswer = async () => {
        if (!userAnswer.trim()) return;

        try {
            const questionId = questions[currentIndex]?.questionId || currentIndex;
            const result = await submitAndCheckAnswer(quizId, questionId, userAnswer);
            setAnswerResult(result);
            setShowAnswer(true);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleNextQuestion = () => {
        if (!showAnswer) {
            // If answer is not shown, submit answer
            handleSubmitAnswer();
        } else if (currentIndex < questions.length - 1) {
            // If answer is shown and there are more questions, go to next question
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
            setUserAnswer('');
            setAnswerResult(null);
        } else if (currentIndex === questions.length - 1) {
            // Last question - register progress
            registerProgress(quizId, questions.length);

            // Show completion message or navigate
            navigate('/');
        }
    };

    const handlePreviousQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowAnswer(false);
            setUserAnswer('');
            setAnswerResult(null);
        }
    };

    const handleReturnToMenu = () => {
        navigate('/');
    };

    if (loading) return <LoadingScreen />;

    if (error) {
        return (
            <div className="quiz-container">
                <div className="quiz-card-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button
                        className="nav-button button-primary"
                        onClick={() => navigate('/')}
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    const renderCategoryPath = () => {
        const categories = [
            currentSet.category,
            currentSet.subCategory1,
            currentSet.subCategory2
        ].filter(Boolean);

        return categories.join(' > ');
    };

    return (
        <QuizScreen
            currentSet={currentSet}
            currentIndex={currentIndex}
            showAnswer={showAnswer}
            showSetInfo={showSetInfo}
            showModal={showModal}
            favorites={favorites}
            userAnswer={userAnswer}
            answerResult={answerResult}
            onUserAnswerChange={handleUserAnswerChange}
            onSubmitAnswer={handleSubmitAnswer}
            onToggleFavorite={() => handleToggleFavorite(quizId)}
            onToggleSetInfo={() => setShowSetInfo(!showSetInfo)}
            onShowModal={() => setShowModal(true)}
            onHideModal={() => setShowModal(false)}
            onPrevious={handlePreviousQuestion}
            onNext={handleNextQuestion}
            onReturnToMenu={handleReturnToMenu}
            renderCategoryPath={renderCategoryPath}
        />
    );
};

export default QuizPage;

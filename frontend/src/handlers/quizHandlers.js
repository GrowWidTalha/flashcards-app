export const handleNextQuestion = (currentIndex, setCurrentIndex, showAnswer, setShowAnswer, currentSet, handleSubmitAnswer, setUserAnswer, setAnswerResult) => {
    if (!currentSet?.questions) return;

    if (!showAnswer) {
        // If answer is not shown, submit answer
        handleSubmitAnswer();
    } else {
        if (currentIndex < currentSet.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
            setUserAnswer && setUserAnswer('');
            setAnswerResult && setAnswerResult(null);
        }
    }
};

export const handlePreviousQuestion = (currentIndex, setCurrentIndex, setShowAnswer, setUserAnswer, setAnswerResult) => {
    if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setShowAnswer(false);
        setUserAnswer && setUserAnswer('');
        setAnswerResult && setAnswerResult(null);
    }
};

export const returnToMainMenu = (setCurrentSet, setCurrentIndex, setShowAnswer, setUserAnswer, setAnswerResult) => {
    setCurrentSet(null);
    setCurrentIndex(0);
    setShowAnswer(false);
    setUserAnswer && setUserAnswer('');
    setAnswerResult && setAnswerResult(null);
};

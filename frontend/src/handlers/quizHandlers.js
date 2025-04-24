export const handleNextQuestion = (currentIndex, setCurrentIndex, showAnswer, setShowAnswer, currentSet) => {
    if (!currentSet?.questions) return;

    if (showAnswer) {
        if (currentIndex < currentSet.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
        }
    } else {
        setShowAnswer(true);
    }
};

export const handlePreviousQuestion = (currentIndex, setCurrentIndex, setShowAnswer) => {
    if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setShowAnswer(false);
    }
};

export const returnToMainMenu = (setCurrentSet, setCurrentIndex, setShowAnswer) => {
    setCurrentSet(null);
    setCurrentIndex(0);
    setShowAnswer(false);
};
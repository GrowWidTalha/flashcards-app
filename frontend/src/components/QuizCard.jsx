import React from "react";

const QuizCard = ({ children }) => {
  return (
    <div className="glass-card rounded-xl p-6 w-full max-w-3xl mx-auto my-8 text-white">
      {children}
    </div>
  );
};

export default QuizCard;

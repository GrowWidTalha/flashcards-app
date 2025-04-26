import React from "react";
import { Spinner } from "react-bootstrap";
import "./Quiz.css";

const LoadingScreen = () => {
    return (
        <div className="loading-container">
            <Spinner
                animation="border"
                variant="primary"
                className="loading-spinner"
                role="status"
            />
            <h4 className="text-primary mt-3">Loading...</h4>
            <p className="text-muted">Please wait while we prepare your content</p>
        </div>
    );
};

export default LoadingScreen;

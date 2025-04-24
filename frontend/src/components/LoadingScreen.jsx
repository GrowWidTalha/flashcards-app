import React from "react";
import { Spinner } from "react-bootstrap";
import "./Quiz.css";

const LoadingScreen = () => (
  <div className="loading-container">
    <Spinner animation="border" variant="primary" className="m-2" />
    <p className="loading-text">Loading quiz data, please wait...</p>
  </div>
);

export default LoadingScreen;

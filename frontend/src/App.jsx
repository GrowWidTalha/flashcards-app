import React from 'react';
import Quiz from "./components/Quiz";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import "./index.css";
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import FeedbackPopup from './components/FeedbackPopup';
import Feedback from './pages/Feedback';
import Ratings from './pages/Ratings';
import Reports from './pages/Reports';
import Users from './pages/Users';

function App() {
    return (
        <Router>
            <FeedbackPopup />
            <Routes>
                <Route path="/register" element={
                    <PublicRoute><Register /></PublicRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute><Login /></PublicRoute>
                } />
                <Route path="/" element={
                    <ProtectedRoute><Quiz /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute><AdminPanel /></ProtectedRoute>
                } />
                <Route path="/feedback" element={
                    <ProtectedRoute><Feedback /></ProtectedRoute>
                } />
                <Route path="/ratings" element={
                    <ProtectedRoute><Ratings /></ProtectedRoute>
                } />
                <Route path="/reports" element={
                    <ProtectedRoute><Reports /></ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute><Users /></ProtectedRoute>
                } />
                <Route path="*" element={<Quiz />} />
            </Routes>
        </Router>
    );
}

export default App;

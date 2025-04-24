import React from 'react';
import Quiz from "./components/Quiz";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import "./index.css";
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
    return (
        <Router>
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
                <Route path="*" element={<Quiz />} />
            </Routes>
        </Router>
    );
}

export default App;

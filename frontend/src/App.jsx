import React from 'react';
import Quiz from "./components/Quiz";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import "./index.css";
import Register from './pages/Register';
import Login from './pages/Login';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Quiz />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Quiz />} />
            </Routes>
        </Router>
    );
}

export default App;

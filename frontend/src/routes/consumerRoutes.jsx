import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// Consumer pages
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Feedback from '../pages/Feedback';
import ModulePage from '../pages/ModulePage';
// import ModuleDetailPage from '../pages/ModuleDetailPage';
import ModuleQuizPage from '../pages/ModuleQuizPage';
import QuizPage from '../pages/QuizPage';

// Define consumer routes
const consumerRoutes = [
    // Public routes
    {
        path: '/register',
        element: <PublicRoute><Register /></PublicRoute>,
    },
    {
        path: '/login',
        element: <PublicRoute><Login /></PublicRoute>,
    },

    // Protected consumer routes
    {
        path: '/',
        element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
        path: '/module/:moduleCode',
        element: <ProtectedRoute><ModuleQuizPage /></ProtectedRoute>,
    },
    // {
    //     path: '/quiz/:quizId',
    //     element: <ProtectedRoute><QuizPage /></ProtectedRoute>,
    // },
    {
        path: '/feedback',
        element: <ProtectedRoute><Feedback /></ProtectedRoute>,
    },

    // Fallback route
    {
        path: '*',
        element: <ProtectedRoute><ModulePage /></ProtectedRoute>,
    }
];

export default consumerRoutes;

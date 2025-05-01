import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// Consumer pages
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Feedback from '../pages/Feedback';
import ModuleQuizPage from '../pages/ModuleQuizPage';

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
    {
        path: '/',
        element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
        path: '/module/:moduleCode',
        element: <ProtectedRoute><ModuleQuizPage /></ProtectedRoute>,
    },
    {
        path: '/feedback',
        element: <ProtectedRoute><Feedback /></ProtectedRoute>,
    },

    // Fallback route
    {
        path: '*',
        element: <ProtectedRoute><Home /></ProtectedRoute>,
    }
];

export default consumerRoutes;

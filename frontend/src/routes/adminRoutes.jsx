import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

// Admin pages
import AdminPanel from '../components/AdminPanel';
import Ratings from '../pages/Ratings';
import Reports from '../pages/Reports';
import Users from '../pages/Users';
import Feedback from '../pages/Feedback';

// Define admin routes
const adminRoutes = [
    {
        path: '',
        element: <ProtectedRoute><AdminPanel /></ProtectedRoute>
    },
    {
        path: 'users',
        element: <ProtectedRoute><Users /></ProtectedRoute>
    },
    {
        path: 'ratings',
        element: <ProtectedRoute><Ratings /></ProtectedRoute>
    },
    {
        path: 'reports',
        element: <ProtectedRoute><Reports /></ProtectedRoute>
    },
    {
        path: 'feedback',
        element: <ProtectedRoute><Feedback /></ProtectedRoute>
    }
];

export default adminRoutes;

import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

// Admin pages
import AdminPanel from '../components/AdminPanel';
import Ratings from '../pages/Ratings';
import Reports from '../pages/Reports';
import Users from '../pages/Users';

// Define admin routes
const adminRoutes = [
    {
        path: '/admin',
        element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
    },
    {
        path: '/admin/ratings',
        element: <ProtectedRoute><Ratings /></ProtectedRoute>,
    },
    {
        path: '/admin/reports',
        element: <ProtectedRoute><Reports /></ProtectedRoute>,
    },
    {
        path: '/admin/users',
        element: <ProtectedRoute><Users /></ProtectedRoute>,
    }
];

export default adminRoutes;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import consumerRoutes from './consumerRoutes';
import adminRoutes from './adminRoutes';
import ConsumerLayout from '../layouts/ConsumerLayout';
import AdminLayout from '../layouts/AdminLayout';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {consumerRoutes
                .filter(route => !route.path.startsWith('/'))
                .map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}

            {/* Consumer Routes */}
            <Route path="/" element={<ConsumerLayout />}>
                {consumerRoutes
                    .filter(route => route.path.startsWith('/'))
                    .map(route => (
                        <Route
                            key={route.path}
                            path={route.path.replace('/', '')}
                            element={route.element}
                        />
                    ))}
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
                {adminRoutes.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={consumerRoutes.find(route => route.path === '*').element} />
        </Routes>
    );
};

export default AppRoutes;

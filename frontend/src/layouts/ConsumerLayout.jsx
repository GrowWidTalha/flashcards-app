import React from 'react';
import { Outlet } from 'react-router-dom';
import FeedbackPopup from '../components/FeedbackPopup';

const ConsumerLayout = () => {
    return (
        <div className="consumer-layout">
            <FeedbackPopup />
            <Outlet />
        </div>
    );
};

export default ConsumerLayout;

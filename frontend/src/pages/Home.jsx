import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModuleList from '../components/ModuleList';
import FileUploadModal from '../components/FileUploadModal';
import SearchBar from '../components/SearchBar';
import '../components/ModuleSet.css';
import { Button } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';

const Home = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleUploadComplete = () => {
        // Increment refresh trigger to cause ModuleList to refetch data
        setRefreshTrigger(prev => prev + 1);
        setShowUploadModal(false);
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="main-title">Quiz Modules</h1>
                <div className="d-flex gap-2">
                    <Link to="/my-attempts" className="btn btn-outline-primary">
                        View My Attempts
                    </Link>
                    <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                        <FaUpload className="me-2" />
                        Upload Questions
                    </Button>
                </div>
            </div>

            <SearchBar />
            <ModuleList refreshTrigger={refreshTrigger} />

            <FileUploadModal
                show={showUploadModal}
                handleClose={() => setShowUploadModal(false)}
                onUploadComplete={handleUploadComplete}
            />
        </div>
    );
};

export default Home;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModuleList from '../components/ModuleList';
import FileUploadModal from '../components/FileUploadModel';
import SearchBar from '../components/SearchBar';
import '../components/ModuleSet.css';

const Home = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadComplete = () => {
        // Increment refresh trigger to cause ModuleList to refetch data
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="main-title">Quiz Modules</h1>
                <div className="d-flex gap-2">
                    <Link to="/my-attempts" className="btn btn-outline-primary">
                        View My Attempts
                    </Link>
                    <FileUploadModal onUploadComplete={handleUploadComplete} />
                </div>
            </div>

            <SearchBar />
            <ModuleList refreshTrigger={refreshTrigger} />
        </div>
    );
};

export default Home;

import React, { useState } from 'react';
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
                <FileUploadModal onUploadComplete={handleUploadComplete} />
            </div>

            <SearchBar />
            <ModuleList refreshTrigger={refreshTrigger} />
        </div>
    );
};

export default Home;

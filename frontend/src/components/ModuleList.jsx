import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllModules } from '../services/moduleService';
import LoadingScreen from './LoadingScreen';
import './ModuleSet.css';

const ModuleList = ({ refreshTrigger = 0 }) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                const data = await getAllModules();
                setModules(data);
            } catch (err) {
                setError('Failed to load modules. Please try again later.');
                console.error('Error fetching modules:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, [refreshTrigger]);

    if (loading) return <LoadingScreen />;

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="module-list-container">
            <h2>Select a Module</h2>
            {modules.length === 0 ? (
                <div className="text-center py-5">
                    <p>No modules available. Upload questions to create modules.</p>
                </div>
            ) : (
                <div className="module-grid">
                    {modules.map((module) => (
                        <Link
                            to={`/module/${module.moduleCode}`}
                            key={module.moduleCode}
                            className="module-card"
                        >
                            <div className="module-card-content">
                                <h3>{module.moduleCode}</h3>
                                <p className="module-code">{module.moduleName}</p>
                                {module.moduleDescription && (
                                    <p className="module-description">{module.moduleDescription}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModuleList;

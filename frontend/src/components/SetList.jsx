import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getModuleByCode } from '../services/moduleService';
import LoadingScreen from './LoadingScreen';
import './ModuleSet.css';

const SetList = () => {
    const { moduleCode } = useParams();
    const navigate = useNavigate();
    const [moduleData, setModuleData] = useState(null);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModuleAndSets = async () => {
            try {
                setLoading(true);
                const data = await getModuleByCode(moduleCode);
                setModuleData(data.module);
                setSets(data.sets);
            } catch (err) {
                setError('Failed to load sets. Please try again later.');
                console.error('Error fetching sets:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchModuleAndSets();
    }, [moduleCode]);

    // Group sets by their setGroup
    const groupedSets = sets.reduce((groups, set) => {
        const group = set.setGroup;
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(set);
        return groups;
    }, {});

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
        <div className="set-list-container">
            <div className="set-list-header">
                <button onClick={() => navigate(-1)} className="btn btn-secondary back-button">
                    Back to Modules
                </button>
                <h2>{moduleData?.moduleName || 'Module Sets'}</h2>
                <p className="module-code">{moduleCode}</p>
                {moduleData?.moduleDescription && (
                    <p className="module-description">{moduleData.moduleDescription}</p>
                )}
            </div>

            {sets.length === 0 ? (
                <p>No sets available in this module.</p>
            ) : (
                Object.entries(groupedSets).map(([groupName, groupSets]) => (
                    <div key={groupName} className="set-group">
                        <h3 className="set-group-title">{groupName}</h3>
                        <div className="set-grid">
                            {groupSets.map((set) => (
                                <Link
                                    to={`/module/${set.setCode}`}
                                    key={set.setCode}
                                    className="set-card"
                                >
                                    <div className="set-card-content">
                                        <h4>{set.setName}</h4>
                                        <p className="set-code">{set.setCode}</p>
                                        <p className="question-count">{set.questionCount} questions</p>
                                        {set.setDescription && (
                                            <p className="set-description">{set.setDescription}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SetList;

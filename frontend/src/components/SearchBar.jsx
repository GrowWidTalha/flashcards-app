import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchContent } from '../services/searchService';
import './ModuleSet.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ modules: [], sets: [], questions: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    // Handle search when query changes
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsSearching(true);
                try {
                    const searchResults = await searchContent(query);
                    setResults(searchResults);
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults({ modules: [], sets: [], questions: [] });
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder="Search modules, sets, or questions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                    onFocus={() => query.trim().length >= 2 && setShowResults(true)}
                />
                {isSearching && <div className="search-spinner"></div>}
            </div>

            {showResults && (
                <div className="search-results">
                    {isSearching && (
                        <div className="search-loading-overlay">
                            <div>
                                <div className="search-spinner"></div>
                                <div className="search-loading-text">Searching...</div>
                            </div>
                        </div>
                    )}
                    {results?.modules?.length === 0 && results?.sets?.length === 0 && results?.questions?.length === 0 ? (
                        <div className="no-results">No results found</div>
                    ) : (
                        <>
                            {results?.modules?.length > 0 && (
                                <div className="search-section">
                                    <h4 className="search-section-title">Modules</h4>
                                    {results?.modules?.map((module) => (
                                        <Link
                                            to={`/module/${module.moduleCode}`}
                                            key={module.moduleCode}
                                            className="search-result-item"
                                            onClick={() => setShowResults(false)}
                                        >
                                            <div className="search-result-content">
                                                <h5>{module.moduleName}</h5>
                                                <p className="search-result-code">{module.moduleCode}</p>
                                                {module.moduleDescription && (
                                                    <p className="search-result-description">{module.moduleDescription}</p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {results?.sets?.length > 0 && (
                                <div className="search-section">
                                    <h4 className="search-section-title">Sets</h4>
                                    {results?.sets?.map((set) => (
                                        <Link
                                            to={`/set/${set.setCode}`}
                                            key={set.setCode}
                                            className="search-result-item"
                                            onClick={() => setShowResults(false)}
                                        >
                                            <div className="search-result-content">
                                                <h5>{set.setName}</h5>
                                                <p className="search-result-code">{set.setCode}</p>
                                                <p className="search-result-module">Module: {set.moduleCode}</p>
                                                {set.setDescription && (
                                                    <p className="search-result-description">{set.setDescription}</p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {results?.questions?.length > 0 && (
                                <div className="search-section">
                                    <h4 className="search-section-title">Questions</h4>
                                    {results?.questions?.map((question) => (
                                        <Link
                                            to={`/set/${question.setCode}`}
                                            key={question._id}
                                            className="search-result-item"
                                            onClick={() => setShowResults(false)}
                                        >
                                            <div className="search-result-content">
                                                <h5>{question.question}</h5>
                                                <p className="search-result-code">
                                                    Set: {question.setName} ({question.setCode})
                                                </p>
                                                <p className="search-result-module">
                                                    Module: {question.moduleName}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

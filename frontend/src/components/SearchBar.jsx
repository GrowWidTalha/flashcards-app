import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchSets } from '../services/setService';
import './ModuleSet.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    // Handle search when query changes
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsSearching(true);
                try {
                    const searchResults = await searchSets(query);
                    setResults(searchResults);
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
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
                    placeholder="Search sets by code or keywords..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                    onFocus={() => query.trim().length >= 2 && setShowResults(true)}
                />
                {isSearching && <div className="search-spinner"></div>}
            </div>

            {showResults && (
                <div className="search-results">
                    {results.length > 0 ? (
                        results.map((set) => (
                            <Link
                                to={`/module/${set.setCode}`}
                                key={set.setCode}
                                className="search-result-item"
                                onClick={() => setShowResults(false)}
                            >
                                <div className="search-result-content">
                                    <h4>{set.setName}</h4>
                                    <p className="search-result-code">{set.setCode}</p>
                                    <p className="search-result-module">Module: {set.moduleCode}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="no-results">No sets found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

import React from 'react';
import { Card, Badge, Button, Row, Col, Container } from 'react-bootstrap';
import { FaPlay, FaStar, FaClock, FaArrowLeft } from 'react-icons/fa';
import './Quiz.css';

const MySetsScreen = ({
    studiedSets,
    recommendedSets,
    onLoadSet,
    favorites,
    onReturnToMenu
}) => {
    // Format the date to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get the 8 most recently practiced sets
    const recentSets = studiedSets.slice(0, 8);

    // Get recommended sets that haven't been practiced
    const newRecommendations = recommendedSets
        .filter(set => !studiedSets.some(studied => studied.setCode === set.setCode))
        .slice(0, 4);

    return (
        <Container className="py-4">
            <Card className="shadow-lg border-0 glass-card mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center">
                            <Button
                                variant="link"
                                className="me-3 back-button"
                                onClick={onReturnToMenu}
                            >
                                <FaArrowLeft />
                            </Button>
                            <div>
                                <h2 className="text-gradient mb-1">My Sets</h2>
                                <p className="text-muted mb-0">Here are the {recentSets.length} latest sets that you have practiced</p>
                            </div>
                        </div>
                    </div>

                    <Row className="g-4">
                        {recentSets.map((set, index) => (
                            <Col md={6} key={set.setCode || index}>
                                <Card className="h-100 set-card hover-effect">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title mb-0">{set.setName}</h5>
                                            {favorites.includes(set.setCode) && (
                                                <Badge bg="warning" className="favorite-badge">
                                                    <FaStar /> Favorite
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <Badge bg="light" text="dark" className="me-2 custom-badge">
                                                {set.questions?.length || 0} questions
                                            </Badge>
                                            <Badge bg="info" className="custom-badge">
                                                <FaClock className="me-1" />
                                                Last practiced: {formatDate(set.lastPracticed)}
                                            </Badge>
                                        </div>
                                        <p className="text-muted small mb-3">{set.setDescription}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <Badge bg="secondary" className="custom-badge">
                                                    Times practiced: {set.timesPracticed || 1}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="primary"
                                                className="practice-btn"
                                                onClick={() => onLoadSet(set.setCode)}
                                            >
                                                <FaPlay className="me-2" /> Practice Again
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {newRecommendations.length > 0 && (
                        <>
                            <h3 className="text-gradient mt-5 mb-4">Recommended for You</h3>
                            <Row className="g-4">
                                {newRecommendations.map((set, index) => (
                                    <Col md={6} key={set.setCode || index}>
                                        <Card className="h-100 set-card hover-effect">
                                            <Card.Body>
                                                <h5 className="card-title mb-2">{set.setName}</h5>
                                                <div className="mb-3">
                                                    <Badge bg="light" text="dark" className="me-2 custom-badge">
                                                        {set.questions?.length || 0} questions
                                                    </Badge>
                                                    {set.category && (
                                                        <Badge bg="info" className="custom-badge">{set.category}</Badge>
                                                    )}
                                                </div>
                                                <p className="text-muted small mb-3">{set.setDescription}</p>
                                                <div className="text-end">
                                                    <Button
                                                        variant="outline-primary"
                                                        className="start-btn"
                                                        onClick={() => onLoadSet(set.setCode)}
                                                    >
                                                        <FaPlay className="me-2" /> Start Set
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </Card.Body>
            </Card>

            <style jsx>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                }

                .text-gradient {
                    background: linear-gradient(45deg, #3a7bd5, #00d2ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .set-card {
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }

                .hover-effect:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }

                .card-title {
                    color: #2c3e50;
                    font-weight: 600;
                }

                .back-button {
                    color: #3a7bd5;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .back-button:hover {
                    background: rgba(58, 123, 213, 0.1);
                    color: #3a7bd5;
                }

                .practice-btn, .start-btn {
                    border-radius: 20px;
                    padding: 8px 16px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                }

                .practice-btn {
                    background: linear-gradient(45deg, #3a7bd5, #00d2ff);
                    border: none;
                }

                .practice-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(58, 123, 213, 0.3);
                }

                .start-btn {
                    border: 2px solid #3a7bd5;
                    color: #3a7bd5;
                }

                .start-btn:hover {
                    background: linear-gradient(45deg, #3a7bd5, #00d2ff);
                    border-color: transparent;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(58, 123, 213, 0.3);
                }

                .custom-badge {
                    padding: 6px 12px;
                    font-weight: 500;
                    font-size: 0.85rem;
                }

                .favorite-badge {
                    padding: 6px 12px;
                    font-weight: 500;
                    background: linear-gradient(45deg, #f1c40f, #f39c12);
                    border: none;
                }
            `}</style>
        </Container>
    );
};

export default MySetsScreen;

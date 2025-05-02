import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { ratingsApi } from '../services/api';
import { FaStar, FaExclamationCircle } from 'react-icons/fa';

const Ratings = () => {
    const [ratings, setRatings] = useState([]);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await ratingsApi.getAll();

                // Check the structure of the response
                if (response && response.data) {
                    // If the response has a nested ratings property
                    if (response.data.ratings) {
                        setRatings(response.data.ratings);
                        // If stats are also provided, use them
                        if (response.data.stats) {
                            setStats(response.data.stats);
                        } else {
                            // Calculate basic stats if not provided
                            calculateStats(response.data.ratings);
                        }
                    } else {
                        // If the data is a flat array of ratings
                        setRatings(Array.isArray(response.data) ? response.data : []);
                        calculateStats(Array.isArray(response.data) ? response.data : []);
                    }
                } else {
                    setRatings([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching ratings:', err);
                setError('Failed to fetch ratings. Please check the API endpoint.');
                setLoading(false);
            }
        };

        // Calculate basic stats from ratings array
        const calculateStats = (ratingsArray) => {
            if (!Array.isArray(ratingsArray) || ratingsArray.length === 0) {
                setStats({
                    averageRating: 0,
                    totalRatings: 0,
                    ratingDistribution: {}
                });
                return;
            }

            // Count total ratings
            const totalRatings = ratingsArray.length;

            // Calculate average
            const valueField = ratingsArray[0].overallRating !== undefined ? 'overallRating' : 'value';
            const sum = ratingsArray.reduce((acc, curr) => acc + (curr[valueField] || 0), 0);
            const average = sum / totalRatings;

            // Create distribution
            const distribution = {};
            for (let i = 1; i <= 5; i++) {
                distribution[i] = ratingsArray.filter(r => r[valueField] === i).length;
            }

            setStats({
                averageRating: average,
                totalRatings,
                ratingDistribution: distribution
            });
        };

        fetchRatings();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    const renderStars = (rating) => {
        if (!rating && rating !== 0) return '';
        return '★'.repeat(Math.min(Math.round(rating), 5));
    };

    return (
        <Container>
            <h1 className="mb-4">Ratings Overview</h1>

            {error && (
                <Alert variant="warning" dismissible onClose={() => setError(null)}>
                    <FaExclamationCircle className="me-2" />
                    {error}
                </Alert>
            )}

            {/* Statistics Section */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center">
                            <h3>Average Rating</h3>
                            <div className="text-warning fs-2">
                                {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                                <FaStar className="ms-1" />
                            </div>
                        </Col>
                        <Col md={4} className="text-center">
                            <h3>Total Ratings</h3>
                            <div className="fs-2">{stats.totalRatings || 0}</div>
                        </Col>
                        <Col md={4} className="text-center">
                            <h3>Distribution</h3>
                            <div className="d-flex justify-content-center">
                                {Object.keys(stats.ratingDistribution || {}).length > 0 ? (
                                    Object.entries(stats.ratingDistribution).map(([rating, count]) => (
                                        <div key={rating} className="mx-1 text-center">
                                            <div className="text-warning">{renderStars(Number(rating))}</div>
                                            <div>{count}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No ratings yet</div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Recent Ratings */}
            <h2 className="mb-3">Recent Ratings</h2>

            {ratings.length === 0 ? (
                <Alert variant="info">No ratings have been submitted yet.</Alert>
            ) : (
                <Row>
                    {ratings.map((rating) => (
                        <Col md={6} lg={4} className="mb-4" key={rating._id || Math.random()}>
                            <Card className="h-100 shadow-sm">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{rating.userName || rating.user?.name || 'Anonymous'}</strong>
                                    </div>
                                    <Badge bg="warning" text="dark">
                                        {renderStars(rating.overallRating || rating.value || 0)}
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    {rating.setCode && (
                                        <div className="mb-2">
                                            <Badge bg="info">{rating.setCode}</Badge>
                                        </div>
                                    )}
                                    {(rating.comment || rating.feedback) && (
                                        <Card.Text>{rating.comment || rating.feedback}</Card.Text>
                                    )}
                                    {rating.difficultyRating && (
                                        <div className="mt-2">
                                            <small className="text-muted">
                                                Difficulty: {rating.difficultyRating}/5
                                            </small>
                                        </div>
                                    )}
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    {rating.createdAt ?
                                        new Date(rating.createdAt).toLocaleDateString() :
                                        'Unknown date'}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Ratings;

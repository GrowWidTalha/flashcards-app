import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { feedbackApi } from '../services/api';
import { FaComments, FaExclamationCircle } from 'react-icons/fa';

const Feedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await feedbackApi.getAll();

                if (response && response.data) {
                    setFeedback(response.data);
                } else {
                    setFeedback([]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError('Failed to fetch feedback. Please check if the API is available.');
                setFeedback([]);
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    const renderStars = (rating) => {
        if (!rating || isNaN(rating)) return '';
        return '★'.repeat(Math.min(rating, 5));
    };

    return (
        <Container>
            <h1 className="mb-4">
                <FaComments className="me-2 text-primary" />
                User Feedback
            </h1>

            {error && (
                <Alert variant="warning" dismissible onClose={() => setError(null)}>
                    <FaExclamationCircle className="me-2" />
                    {error}
                </Alert>
            )}

            <Row>
                {feedback.length > 0 ? feedback.map((item) => (
                    <Col md={6} lg={4} className="mb-4" key={item._id || Math.random()}>
                        <Card className="h-100 shadow-sm">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{item.userName || item.user?.name || 'Anonymous'}</strong>
                                </div>
                                <Badge bg="warning" text="dark">
                                    {renderStars(item.rating)}
                                </Badge>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>{item.message || 'No message provided'}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-muted">
                                {item.createdAt ?
                                    new Date(item.createdAt).toLocaleDateString() :
                                    'Unknown date'}
                            </Card.Footer>
                        </Card>
                    </Col>
                )) : (
                    <Col xs={12}>
                        <Alert variant="info">No feedback submitted yet.</Alert>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Feedback;

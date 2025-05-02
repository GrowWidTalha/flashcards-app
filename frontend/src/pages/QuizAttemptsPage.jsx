import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Container, Row, Col, Card, Badge, Spinner, Modal } from 'react-bootstrap';
import { getUserAttempts, getAttemptDetails } from '../services/quizAttemptService';
import { formatDistanceToNow } from 'date-fns';

const QuizAttemptsPage = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                setLoading(true);
                const data = await getUserAttempts();
                setAttempts(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching attempts:', err);
                setError('Failed to load attempt history. Please try again later.');
                setLoading(false);
            }
        };

        fetchAttempts();
    }, []);

    const handleShowDetails = async (attemptId) => {
        try {
            setLoading(true);
            const data = await getAttemptDetails(attemptId);
            setSelectedAttempt(data);
            setShowDetails(true);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching attempt details:', err);
            setError('Failed to load attempt details. Please try again later.');
            setLoading(false);
        }
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedAttempt(null);
    };

    // Group attempts by set
    const attemptsBySet = attempts.reduce((acc, attempt) => {
        // Skip if set info is missing
        if (!attempt.set || !attempt.set._id) return acc;

        const setId = attempt.set._id;
        if (!acc[setId]) {
            acc[setId] = {
                setName: attempt.set.setName || 'Unknown Set',
                setCode: attempt.set.setCode || 'unknown',
                attempts: []
            };
        }
        acc[setId].attempts.push(attempt);
        return acc;
    }, {});

    if (loading && !showDetails) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error && !showDetails) {
        return (
            <Container className="mt-5" style={{ backgroundColor: "white" }}>
                <Card className="text-center">
                    <Card.Body>
                        <Card.Title>Error</Card.Title>
                        <Card.Text>{error}</Card.Text>
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Return to Home
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="mt-4 p-4 rounded-3 mb-5" style={{ backgroundColor: "white" }}>
            <Row className="mb-4">
                <Col>
                    <h1>Your Quiz Attempts</h1>
                    <p>View your quiz history and performance across different sets</p>
                </Col>
                <Col className="text-end">
                    <Button variant="outline-primary" onClick={() => navigate('/')}>
                        Return to Home
                    </Button>
                </Col>
            </Row>

            {Object.values(attemptsBySet).length === 0 ? (
                <Card className="text-center">
                    <Card.Body>
                        <Card.Title>No Attempts Yet</Card.Title>
                        <Card.Text>You haven't attempted any quizzes yet.</Card.Text>
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Go to Modules
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                Object.values(attemptsBySet).map((setData) => (
                    <Card className="mb-4" key={setData.setCode}>
                        <Card.Header>
                            <h4>{setData.setName}</h4>
                            <Badge bg="info">Total Attempts: {setData.attempts.length}</Badge>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Questions</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {setData.attempts
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .map((attempt) => (
                                            <tr key={attempt._id}>
                                                <td>
                                                    {new Date(attempt.createdAt).toLocaleDateString()} - {new Date(attempt.createdAt).toLocaleTimeString()}
                                                    <div className="text-muted small">
                                                        {formatDistanceToNow(new Date(attempt.createdAt), { addSuffix: true })}
                                                    </div>
                                                </td>
                                                <td>{attempt.totalQuestions || 0}</td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => handleShowDetails(attempt._id)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                ))
            )}

            {/* Attempt Details Modal */}
            <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedAttempt?.set?.setName || 'Quiz'} Attempt Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : selectedAttempt ? (
                        <>
                            <div className="mb-3">
                                <strong>Date:</strong> {new Date(selectedAttempt.createdAt).toLocaleString()}
                            </div>
                            <h5 className="mb-3">Answers:</h5>
                            {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Question</th>
                                            <th>Your Answer</th>
                                            <th>Correct Answer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedAttempt.answers.map((answer, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{answer.questionText || 'N/A'}</td>
                                                <td>{answer.userAnswer || 'No answer'}</td>
                                                <td>{answer.correctAnswer || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p>No answers available for this attempt.</p>
                            )}
                        </>
                    ) : (
                        <div className="text-center">No data available</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetails}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default QuizAttemptsPage;

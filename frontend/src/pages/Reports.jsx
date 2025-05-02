import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { reportsApi } from '../services/api';
import { FaExclamationTriangle, FaCheck, FaTimes, FaFlag } from 'react-icons/fa';

const Reports = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                // First try to get all reports for the user
                const response = await reportsApi.getAll();

                // If that fails, we'll try to get all reports for all sets
                // (this approach depends on backend implementation)
                if (!response.data || response.data.length === 0) {
                    setComplaints([]);
                } else {
                    setComplaints(response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching complaints:", err);
                setError('Failed to fetch complaints. Please check if the API is available.');
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const handleMarkResolved = async (id) => {
        try {
            // You would implement this API endpoint:
            // await reportsApi.updateStatus(id, 'resolved');

            // For now, just update the UI
            setComplaints(complaints.map(complaint =>
                complaint._id === id ? { ...complaint, status: 'resolved' } : complaint
            ));
        } catch (err) {
            setError('Failed to update complaint status');
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <h1 className="mb-4">
                <FaExclamationTriangle className="me-2 text-warning" />
                User Complaints
            </h1>

            {complaints.length === 0 ? (
                <Alert variant="info">No complaints have been submitted yet.</Alert>
            ) : (
                <Row>
                    {complaints.map((complaint) => (
                        <Col md={6} lg={4} className="mb-4" key={complaint._id || Math.random()}>
                            <Card className={complaint.status === 'resolved' ? 'border-success' : 'border-warning'}>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{complaint.userName || complaint.user?.name || 'Anonymous'}</strong>
                                    </div>
                                    <Badge bg={complaint.status === 'resolved' ? 'success' : 'warning'}>
                                        {complaint.status || 'pending'}
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title className="d-flex align-items-center">
                                        <FaFlag className="me-2 text-danger" />
                                        {complaint.setName || complaint.setCode || 'General Issue'}
                                    </Card.Title>
                                    <Card.Text>
                                        {complaint.message || complaint.description || 'No details provided'}
                                    </Card.Text>
                                    <div className="mt-3">
                                        <strong>Rating: </strong>
                                        <Badge bg="secondary">{complaint.qualityRating || complaint.rating || 'N/A'}/5</Badge>
                                    </div>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-between align-items-center text-muted">
                                    <small>
                                        {complaint.createdAt || complaint.timestamp ?
                                            new Date(complaint.createdAt || complaint.timestamp).toLocaleDateString() :
                                            'Unknown date'}
                                    </small>
                                    {complaint.status !== 'resolved' && (
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => handleMarkResolved(complaint._id)}
                                        >
                                            <FaCheck className="me-1" /> Mark Resolved
                                        </Button>
                                    )}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Reports;

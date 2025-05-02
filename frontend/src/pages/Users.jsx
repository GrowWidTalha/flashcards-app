import React, { useState, useEffect } from 'react';
import { Container, Table, Form, InputGroup, Button, Badge, Card, Modal, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { usersApi } from '../services/api';
import { FaSearch, FaUserEdit, FaExclamationCircle } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await usersApi.getAll();

                // Check if the response contains data
                if (response && response.data) {
                    setUsers(response.data);
                } else {
                    // If there's no data, set an empty array and an error message
                    setUsers([]);
                    setError('No user data found. The API may not be properly configured.');
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError('Failed to fetch users. Please check if the admin API is available.');
                setUsers([]);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await usersApi.update(userId, { status: newStatus });
            setUsers(users.map(user =>
                user._id === userId ? { ...user, status: newStatus } : user
            ));
        } catch (err) {
            console.error("Error updating user status:", err);
            setError('Failed to update user status. The API may not support this operation.');
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <Container>
            <h1 className="mb-4">User Management</h1>

            {error && <Alert variant="warning" dismissible onClose={() => setError(null)}>
                <FaExclamationCircle className="me-2" />
                {error}
            </Alert>}

            {/* Search Bar */}
            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>

            {/* Users Table */}
            {users.length === 0 ? (
                <Alert variant="info">No users found. {error ? 'There may be an issue with the API.' : ''}</Alert>
            ) : (
                <Card className="mb-4">
                    <Card.Body className="p-0">
                        <Table hover responsive>
                            <thead className="bg-light">
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id || Math.random()}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                                    style={{ width: '40px', height: '40px' }}>
                                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="ms-3">
                                                    {user.username || 'Unknown'}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email || 'No email'}</td>
                                        <td>
                                            <Badge bg="info">{user.role || 'user'}</Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleUserClick(user)}
                                            >
                                                <FaUserEdit className="me-1" /> View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* User Details Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser?.name || 'User Details'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Row>
                            <Col md={6}>
                                <h5>User Information</h5>
                                <p>Email: {selectedUser.email || 'Not provided'}</p>
                                <p>Role: {selectedUser.role || 'user'}</p>
                                <p>Status: {selectedUser.status || 'unknown'}</p>
                                {selectedUser.createdAt && (
                                    <p>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                )}
                            </Col>
                            <Col md={6}>
                                <h5>Account Status</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Change Status</Form.Label>
                                    <Form.Select
                                        value={selectedUser.status || 'active'}
                                        onChange={(e) => handleStatusChange(selectedUser._id, e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Users;

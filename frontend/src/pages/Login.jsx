import React, { useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../handlers/apiHandlers';
import { saveToken } from '../utils/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(API_BASE_URL + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailOrUsername: email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed. Please try again.');
            }

            saveToken(data.token);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="auth-container">
            <div className="auth-card" style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px" }}>
                <h2 className="text-center mb-4">Welcome Back</h2>

                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email or Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email or username"
                            required
                            disabled={loading}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mb-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <p className="mb-0">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary text-decoration-none">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>

        </Container>
    );
};

export default Login;

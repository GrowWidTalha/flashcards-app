import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { API_BASE_URL } from '../handlers/apiHandlers';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmailToken = async () => {
            if (!token) {
                setVerificationStatus('error');
                setMessage('Verification token is missing.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/verify/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    // Store the token after successful verification
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        setVerificationStatus('success');
                        setMessage(data.message || 'Your email has been successfully verified! You can now log in to your account.');
                    } else {
                        // If no token in response, still show success but note the issue
                        setVerificationStatus('success');
                        setMessage('Your email has been successfully verified! Please log in to your account.');
                        console.warn('No token received after verification');
                    }
                } else {
                    setVerificationStatus('error');
                    setMessage(data.message || 'Email verification failed. Please try again.');
                }
            } catch (error) {
                console.error('Error verifying email:', error);
                setVerificationStatus('error');
                setMessage('A network error occurred. Please try again later.');
            }
        };

        verifyEmailToken();
    }, [token]);

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card className="w-100" style={{ maxWidth: '500px', backgroundColor: 'white', borderRadius: '10px' }}>
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4">Email Verification</h2>

                    {verificationStatus === 'verifying' && (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p className="mt-3">Verifying your email address...</p>
                        </div>
                    )}

                    {verificationStatus === 'success' && (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Success!</Alert.Heading>
                                <p>{message}</p>
                            </Alert>
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={handleGoToHome}>
                                    Go to Home
                                </Button>
                            </div>
                        </>
                    )}

                    {verificationStatus === 'error' && (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Verification Failed</Alert.Heading>
                                <p>{message}</p>
                            </Alert>
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={handleGoToLogin}>
                                    Go to Login
                                </Button>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default VerifyEmail;

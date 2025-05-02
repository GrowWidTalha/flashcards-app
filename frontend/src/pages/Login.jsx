import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { API_BASE_URL } from '../handlers/apiHandlers';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationRequired, setVerificationRequired] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setVerificationRequired(false);

        try {
            const res = await fetch(API_BASE_URL + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailOrUsername: data.emailOrUsername,
                    password: data.password
                })
            });

            const json = await res.json();

            // Email verification required
            if (res.status === 401 && json.isVerified === false) {
                // Do not store token for unverified accounts
                // Assume the login was using an email, save it for resend verification
                setUnverifiedEmail(data.emailOrUsername);
                setVerificationRequired(true);
                setError(json.message || "Please verify your email to continue");
                return;
            }

            if (!res.ok) {
                throw new Error(json.message || "Authentication failed");
            }

            // Normal successful login (email is verified)
            if (json.token) {
                localStorage.setItem("token", json.token);
                navigate("/");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!unverifiedEmail) return;

        setLoading(true);
        try {
            const res = await fetch(API_BASE_URL + "/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: unverifiedEmail })
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Failed to resend verification email");
            }

            alert("Verification email has been resent! Please check your inbox.");
        } catch (err) {
            console.error("Resend verification error:", err);
            alert(err.message || "Failed to resend verification email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="auth-container">
            <div className="auth-card" style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px" }}>
                <h2 className="text-center mb-4">Login</h2>

                {verificationRequired ? (
                    <div className="verification-required">
                        <Alert variant="warning">
                            <Alert.Heading>Email Verification Required</Alert.Heading>
                            <p>{error}</p>
                        </Alert>

                        <div className="d-grid gap-2 mt-4">
                            <Button
                                variant="primary"
                                onClick={handleResendVerification}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" animation="border" className="me-2" />
                                        Sending...
                                    </>
                                ) : "Resend Verification Email"}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                onClick={() => setVerificationRequired(false)}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <Alert variant="danger" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email or Username</Form.Label>
                                <Form.Control
                                    {...register("emailOrUsername", { required: "Email or username is required" })}
                                    isInvalid={!!errors.emailOrUsername}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.emailOrUsername?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    {...register("password", { required: "Password is required" })}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-grid">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="mb-3"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>

                                <div className="text-center">
                                    <p>
                                        Don't have an account?{" "}
                                        <Link to="/register" className="text-decoration-none">
                                            Register
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </Form>
                    </>
                )}
            </div>
        </Container>
    );
};

export default Login;

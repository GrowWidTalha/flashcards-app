import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Alert, Spinner, ProgressBar } from "react-bootstrap";
import { API_BASE_URL } from "../handlers/apiHandlers";

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        trigger,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            email: "",
            username: "",
            password: "",
            country: "",
            city: "",
            age: "",
            profession: "",
            interests: {
                History: 3,
                Psychology: 3,
                Wine: 3,
                Geography: 3,
                Math: 3,
                Economics: 3,
                Art: 3,
                Philosophy: 3,
                Technology: 3,
                Physics: 3,
                Literature: 3,
                "Pop Culture": 3
            }
        },
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(API_BASE_URL + "/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Registration failed");
            }

            if (json.token) {
                localStorage.setItem("token", json.token);
                navigate("/");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        let valid = true;

        if (step === 1) {
            valid = await trigger(["email", "username", "password"]);
        } else if (step === 2) {
            valid = await trigger(["country"]);
        }

        if (valid) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const interestList1 = [
        "History",
        "Psychology",
        "Wine",
        "Geography",
        "Math",
        "Economics"
    ];

    const interestList2 = [
        "Art",
        "Philosophy",
        "Technology",
        "Physics",
        "Literature",
        "Pop Culture"
    ];

    return (
        <Container className="auth-container">
            <div className="auth-card" style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px" }}>
                <div className="mb-4">
                    <ProgressBar now={(step / 3) * 100} className="mb-3" />
                    <h4 className="text-center">Step {step} of 3</h4>
                </div>

                {error && (
                    <Alert variant="danger" className="mb-4" onClose={() => setError("")} dismissible>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                    {step === 1 && (
                        <div className="step-content">
                            <h4 className="mb-3">Basic Information</h4>

                            <Form.Group className="mb-3">
                                <Form.Label>Email*</Form.Label>
                                <Form.Control
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Username*</Form.Label>
                                <Form.Control
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: { value: 3, message: "Username must be at least 3 characters" }
                                    })}
                                    isInvalid={!!errors.username}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.username?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password*</Form.Label>
                                <Form.Control
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content">
                            <h4 className="mb-3">Location & Profile</h4>

                            <Form.Group className="mb-3">
                                <Form.Label>Country*</Form.Label>
                                <Form.Control
                                    {...register("country", { required: "Country is required" })}
                                    isInvalid={!!errors.country}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.country?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control {...register("city")} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Age</Form.Label>
                                <Form.Control
                                    type="number"
                                    {...register("age", {
                                        min: { value: 13, message: "Must be at least 13 years old" },
                                        max: { value: 120, message: "Invalid age" }
                                    })}
                                    isInvalid={!!errors.age}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.age?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Profession</Form.Label>
                                <Form.Control {...register("profession")} />
                            </Form.Group>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-content">
                            <h4 className="mb-3">Your Interests</h4>
                            <p className="text-muted mb-4">Rate your interest in each category from 1 to 5</p>

                            <Row>
                                <Col md={6}>
                                    {interestList1.map((interest) => (
                                        <Form.Group className="mb-3" key={interest}>
                                            <Form.Label className="d-flex justify-content-between">
                                                {interest}
                                                <span className="text-muted">
                                                    <Controller
                                                        control={control}
                                                        name={`interests.${interest}`}
                                                        render={({ field }) => field.value}
                                                    />
                                                </span>
                                            </Form.Label>
                                            <Controller
                                                control={control}
                                                name={`interests.${interest}`}
                                                render={({ field }) => (
                                                    <Form.Range
                                                        {...field}
                                                        min={1}
                                                        max={5}
                                                        className="custom-range"
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                    ))}
                                </Col>
                                <Col md={6}>
                                    {interestList2.map((interest) => (
                                        <Form.Group className="mb-3" key={interest}>
                                            <Form.Label className="d-flex justify-content-between">
                                                {interest}
                                                <span className="text-muted">
                                                    <Controller
                                                        control={control}
                                                        name={`interests.${interest}`}
                                                        render={({ field }) => field.value}
                                                    />
                                                </span>
                                            </Form.Label>
                                            <Controller
                                                control={control}
                                                name={`interests.${interest}`}
                                                render={({ field }) => (
                                                    <Form.Range
                                                        {...field}
                                                        min={1}
                                                        max={5}
                                                        className="custom-range"
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                    ))}
                                </Col>
                            </Row>
                        </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                        {step > 1 && (
                            <Button variant="outline-primary" onClick={handleBack} disabled={loading}>
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button
                                variant="primary"
                                type="button"
                                onClick={handleNext}
                                className={step === 1 ? "ms-auto" : ""}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="success"
                                className={step === 1 ? "ms-auto" : ""}
                                disabled={loading || !isValid}
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
                                        Registering...
                                    </>
                                ) : (
                                    'Complete Registration'
                                )}
                            </Button>
                        )}
                    </div>
                </Form>
            </div>

        </Container>
        // </>
    );
};

export default Register;

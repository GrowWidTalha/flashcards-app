import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL_LOCAL = "http://localhost:5000/api";
const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
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
        mode: "onChange",
        shouldUnregister: false
    });

    const onSubmit = async (data) => {
        try {
            const res = await fetch(API_BASE_URL + "/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.token) {
                localStorage.setItem("token", json.token);
                navigate("/");
            } else {
                alert(json.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        }
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
        <Container style={{ maxWidth: 600, marginTop: 50 }}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                    <>
                        <h4 className="mb-3">
                            Welcome
                            <br />
                            Please complete registration
                        </h4>
                        <p>* = mandatory fields</p>
                        <Form.Group className="mb-2">
                            <Form.Label>Email*</Form.Label>
                            <Form.Control
                                type="email"
                                {...register("email", { required: true })}
                            />
                            {errors.email && (
                                <Form.Text className="text-danger">
                                    Email is required
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Username*</Form.Label>
                            <Form.Control
                                {...register("username", { required: true })}
                            />
                            {errors.username && (
                                <Form.Text className="text-danger">
                                    Username is required
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Password*</Form.Label>
                            <Form.Control
                                type="password"
                                {...register("password", { required: true, minLength: 6 })}
                            />
                            {errors.password && errors.password.type === "required" && (
                                <Form.Text className="text-danger">
                                    Password is required
                                </Form.Text>
                            )}
                            {errors.password && errors.password.type === "minLength" && (
                                <Form.Text className="text-danger">
                                    Minimum length is 6
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Country*</Form.Label>
                            <Form.Control
                                {...register("country", { required: true })}
                            />
                            {errors.country && (
                                <Form.Text className="text-danger">
                                    Country is required
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>City</Form.Label>
                            <Form.Control {...register("city")} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Age</Form.Label>
                            <Form.Control type="number" {...register("age")} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Profession</Form.Label>
                            <Form.Control {...register("profession")} />
                        </Form.Group>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h4 className="mb-3">Interests 1 / 2</h4>
                        <p>Select how much these categories interest you.</p>
                        {interestList1.map((interest) => (
                            <Form.Group className="mb-3" key={interest}>
                                <Form.Label>{interest}</Form.Label>
                                <Controller
                                    control={control}
                                    name={`interests.${interest}`}
                                    render={({ field }) => (
                                        <Form.Range
                                            {...field}
                                            min={1}
                                            max={5}
                                            value={field.value}
                                        />
                                    )}
                                />
                            </Form.Group>
                        ))}
                    </>
                )}

                {step === 3 && (
                    <>
                        <h4 className="mb-3">Interests 2 / 2</h4>
                        <p>Select how much these categories interest you.</p>
                        {interestList2.map((interest) => (
                            <Form.Group className="mb-3" key={interest}>
                                <Form.Label>{interest}</Form.Label>
                                <Controller
                                    control={control}
                                    name={`interests.${interest}`}
                                    render={({ field }) => (
                                        <Form.Range
                                            {...field}
                                            min={1}
                                            max={5}
                                            value={field.value}
                                        />
                                    )}
                                />
                            </Form.Group>
                        ))}
                    </>
                )}

                <Row className="mt-4">
                    <Col xs="auto">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                onClick={() => setStep((s) => s - 1)}
                            >
                                Back
                            </Button>
                        )}
                    </Col>
                    <Col className="text-end">
                        {step < 3 ? (
                            <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
                        ) : (
                            <Button type="submit">Submit</Button>
                        )}
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default Register;

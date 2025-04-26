import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from "../handlers/apiHandlers"

const FeedbackPopup = () => {
    const [show, setShow] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [improvements, setImprovements] = useState('');

    useEffect(() => {
        // Show popup randomly after 2-5 minutes
        const timeout = setTimeout(() => {
            const shouldShow = Math.random() < 0.3; // 30% chance to show
            if (shouldShow) {
                setShow(true);
            }
        }, Math.random() * (300000 - 120000) + 120000); // Random time between 2-5 minutes

        return () => clearTimeout(timeout);
    }, []);

    const handleSubmit = async () => {
        try {
            await axios.post(API_BASE_URL + '/feedback', {
                message: feedback,
                improvements
            });
            setShow(false);
            // Optional: Show success message
        } catch (error) {
            console.error('Error submitting feedback:', error);
            // Optional: Show error message
        }
    };

    const handleClose = () => setShow(false);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            className="feedback-popup"
        >
            <Modal.Header closeButton>
                <Modal.Title>Help Us Improve!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    As we are in early development stage, we are hoping to get your input on
                    improvements and also what type of flashcards that you want to see.
                </p>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Type your feedback here..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Any specific improvements you'd like to see? (Optional)"
                            value={improvements}
                            onChange={(e) => setImprovements(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Continue without feedback
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!feedback.trim()}
                >
                    Submit
                </Button>
            </Modal.Footer>

            <style jsx>{`
                .feedback-popup .modal-content {
                    border-radius: 15px;
                    border: none;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .feedback-popup .modal-header {
                    border-bottom: none;
                    padding: 1.5rem 1.5rem 0.5rem;
                }

                .feedback-popup .modal-body {
                    padding: 1.5rem;
                }

                .feedback-popup .modal-footer {
                    border-top: none;
                    padding: 0.5rem 1.5rem 1.5rem;
                }

                .feedback-popup textarea {
                    border-radius: 10px;
                    border: 1px solid #e0e0e0;
                    padding: 12px;
                    resize: none;
                }

                .feedback-popup textarea:focus {
                    border-color: #80bdff;
                    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
                }

                .feedback-popup .btn {
                    border-radius: 8px;
                    padding: 8px 16px;
                }
            `}</style>
        </Modal>
    );
};

export default FeedbackPopup;

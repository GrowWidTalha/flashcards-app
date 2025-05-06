import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Table, Spinner } from 'react-bootstrap';
import { getAdminQuestions, uploadExcelFile, downloadQuestionsCSV } from '../services/adminService';

const AdminDashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const data = await getAdminQuestions();
            setQuestions(data);
            setError(null);
        } catch (err) {
            setError('Error loading questions: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Reset states
        setError(null);
        setUploadStatus(null);
        setLoading(true);

        try {
            // Validate file type
            if (!file.name.match(/\.(xlsx|csv)$/)) {
                throw new Error('Please upload an Excel (.xlsx) or CSV file');
            }

            // Upload and process file
            const result = await uploadExcelFile(file);

            setUploadStatus({
                success: true,
                message: `Upload successful! Created/Updated: ${result.results.modulesCreated} modules, ${result.results.setsCreated} sets, ${result.results.questionsCreated} questions`
            });

            // Reload questions to show updated data
            await loadQuestions();
        } catch (err) {
            setError('Upload failed: ' + err.message);
            setUploadStatus({
                success: false,
                message: 'Upload failed. Please check the file format and try again.'
            });
        } finally {
            setLoading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    const handleDownload = async () => {
        try {
            await downloadQuestionsCSV();
        } catch (err) {
            setError('Download failed: ' + err.message);
        }
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4">Admin Dashboard</h1>

            {/* File Upload Section */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex gap-3 align-items-center">
                        <input
                            type="file"
                            accept=".xlsx,.csv"
                            onChange={handleFileUpload}
                            className="form-control"
                            style={{ maxWidth: '300px' }}
                            disabled={loading}
                        />
                        <Button
                            variant="primary"
                            onClick={handleDownload}
                            disabled={loading || questions.length === 0}
                        >
                            Download CSV
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Status Messages */}
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}
            {uploadStatus && (
                <Alert
                    variant={uploadStatus.success ? "success" : "danger"}
                    onClose={() => setUploadStatus(null)}
                    dismissible
                >
                    {uploadStatus.message}
                </Alert>
            )}

            {/* Questions Table */}
            <div className="mt-4">
                <h2>Questions Overview</h2>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : questions.length > 0 ? (
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Module</th>
                                <th>Set</th>
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Set Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q, index) => (
                                <tr key={q._id || index}>
                                    <td>
                                        <div>{q.moduleCode}</div>
                                        <small className="text-muted">{q.moduleName}</small>
                                    </td>
                                    <td>
                                        <div>{q.setCode}</div>
                                        <small className="text-muted">{q.setName}</small>
                                    </td>
                                    <td>{q.question}</td>
                                    <td>{q.answer}</td>
                                    <td>{q.setOrder}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">No questions found. Upload a file to get started.</Alert>
                )}
            </div>
        </Container>
    );
};

export default AdminDashboard;

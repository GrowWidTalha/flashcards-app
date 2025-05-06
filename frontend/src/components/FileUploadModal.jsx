import React, { useState, useRef } from 'react';
import { Modal, Form, Alert, Button, Spinner } from 'react-bootstrap';
import { uploadExcelFile, readExcelFile } from '../services/uploadService';

const FileUploadModal = ({ show, handleClose }) => {
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Reset states
        setUploadError(null);
        setUploadSuccess(null);
        setIsUploading(true);

        try {
            // Validate file type
            if (!file.name.match(/\.(xlsx|csv)$/)) {
                throw new Error('Please upload an Excel (.xlsx) or CSV file');
            }

            // Read and process file
            const jsonData = await readExcelFile(file);

            if (!jsonData.length) {
                throw new Error('The uploaded file contains no data.');
            }

            // Upload and process file
            const result = await uploadExcelFile(jsonData);

            // Show success message with details
            setUploadSuccess(
                `Upload successful! Created ${result.results.questionsCreated} questions, ` +
                `${result.results.modulesCreated} new modules, ${result.results.setsCreated} new sets.`
            );

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setUploadError(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">

            <Modal.Header closeButton>
                <Modal.Title>Upload Your Own Questions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Upload an Excel or CSV file using this template:</p>
                <a
                    href="https://docs.google.com/spreadsheets/d/1OP1bEw3k-h1PGf-CVDN4ZZAMGsPcTVbnvUIQPl1S339M/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary mb-3"
                >
                    Download Template
                </a>

                <Form.Group>
                    <Form.Label>Upload your file (.csv or .xlsx):</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        disabled={isUploading}
                    />
                    <Form.Text className="text-muted">
                        Required columns: Question, Answer, Set, Set order<br />
                        Set order format: ModuleCode.Number (e.g., PH1.2)<br />
                        Set Name: max 25 characters<br />
                        Set Description: max 100 characters
                    </Form.Text>
                </Form.Group>

                {isUploading && (
                    <div className="text-center mt-3">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-2">Processing your file...</p>
                    </div>
                )}

                {uploadError && (
                    <Alert variant="danger" className="mt-3">
                        {uploadError}
                    </Alert>
                )}

                {uploadSuccess && (
                    <Alert variant="success" className="mt-3">
                        {uploadSuccess}
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FileUploadModal;

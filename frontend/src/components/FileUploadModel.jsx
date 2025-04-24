import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';

const FileUploadModal = ({ onFileUpload }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="me-2">
                <FaUpload className="me-2" />
                Upload Questions
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Your Own Questions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        It is easy to add your own questions and answers for studying.
                        We aim to offer many methods of input information, but for now,
                        the way you can do it is by filling out this Google Sheet (like
                        Excel, you can copy) and we will review it and add it to the
                        master database.
                    </p>
                    <p>
                        Please go to this link and write down your questions and answers:
                    </p>
                    <a
                        href="https://docs.google.com/spreadsheets/d/1OP1bEw3k-h1PGf-CVDN4ZZAMGsPcTVbnvUIQPl1S339M/edit?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Google Sheet for Question Upload
                    </a>

                    <Form.Group className="mt-4">
                        <Form.Label>Or upload your file (.csv or .xlsx):</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".csv,.xlsx"
                            onChange={onFileUpload}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FileUploadModal;

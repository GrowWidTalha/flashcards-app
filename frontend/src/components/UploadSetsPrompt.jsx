import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaFileUpload, FaTimes } from 'react-icons/fa';

const UploadSetsPrompt = ({ show, onHide, onUploadClick }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="upload-sets-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Would you like to upload your own sets?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-4">
                    <div className="version-badge mb-3">
                        <span className="badge bg-primary">alpha v0.1</span>
                    </div>
                    <p className="mb-4">
                        We are looking to create an easy, flexible and intuitive way for
                        people to add their own flashcard sets and this is early stage.
                    </p>
                    <p className="text-muted small mb-4">
                        The way we offer currently is to copy over questions and answers
                        via google sheets (similar to excel). This is for free but you will need a
                        google account. Fill in your own form here by copying our template
                        and share it to our email user below.
                    </p>
                    <p className="text-info small">
                        If you have any suggestions, please do email: carolagryma AT gmail
                        dot com.
                    </p>
                </div>
                <div className="d-flex justify-content-center gap-3">
                    <Button variant="secondary" onClick={onHide}>
                        <FaTimes className="me-2" />
                        No (take me to next set)
                    </Button>
                    <Button variant="primary" onClick={onUploadClick}>
                        <FaFileUpload className="me-2" />
                        Yes (alpha v0.1)
                    </Button>
                </div>
            </Modal.Body>

            <style jsx>{`
        .upload-sets-modal .modal-content {
          background: white;
          border-radius: 15px;
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .version-badge {
          display: inline-block;
        }

        .version-badge .badge {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
        }

        .modal-header {
          border-bottom: 1px solid #eee;
          padding: 1.5rem;
        }

        .modal-body {
          padding: 2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
        </Modal>
    );
};

export default UploadSetsPrompt;

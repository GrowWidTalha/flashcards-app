import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { uploadUserQuestions } from '../services/questionService';

const FileUploadModal = ({ onUploadComplete }) => {
    const [show, setShow] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const fileInputRef = useRef(null);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setParsedData(null);
        setUploadError('');
        setUploadSuccess(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Normalize keys like " Question " → "Question"
    const normalizeRowKeys = (row) => {
        const normalized = {};
        Object.keys(row).forEach((key) => {
            normalized[key.trim()] = row[key];
        });
        return normalized;
    };

    const processExcelData = (rawRows) => {
        const moduleMap = {};
        const allQuestions = [];

        rawRows.forEach((rawRow) => {
            const row = normalizeRowKeys(rawRow);

            // MUST have these columns
            if (!row.Question || !row.Answer || !row['Set'] || !row['Set order']) {
                return;
            }

            const setCode = String(row['Set']).trim();              // e.g. "WSA-01"
            const orderStr = String(row['Set order']).trim();       // e.g. "WB2.1"
            const [moduleCode, orderPart] = orderStr.split('.');
            const orderNum = parseFloat(orderPart);

            if (!moduleMap[moduleCode]) {
                moduleMap[moduleCode] = {
                    module: moduleCode,
                    sets: {}
                };
            }

            const modEntry = moduleMap[moduleCode];

            if (!modEntry.sets[setCode]) {
                modEntry.sets[setCode] = {
                    code: setCode,
                    order: orderNum,
                    name: row['Set Name (max 25 characters)']?.toString().trim() || setCode,
                    description: row['Set Description (say 100 characters)']?.toString().trim() || '',
                    questions: []
                };
            }

            const setEntry = modEntry.sets[setCode];

            // Build the question object
            const question = {
                question: row.Question,
                answer: row.Answer,
                moreInfo: row['More info'] || '',
                module: moduleCode,
                set: setCode,
                order: orderNum
            };

            setEntry.questions.push(question);
            allQuestions.push(question);
        });

        // Convert moduleMap to an array, sorting sets by `order`
        const modulesArray = Object.values(moduleMap).map((m) => ({
            module: m.module,
            sets: Object.values(m.sets).sort((a, b) => a.order - b.order)
        }));

        setParsedData({ modules: modulesArray, questions: allQuestions });
        return { modulesArray, allQuestions };
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError('');
        setUploadSuccess(false);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(ws);

                if (!jsonData.length) {
                    setUploadError('The uploaded file contains no data.');
                    return;
                }
                // Quick header check
                const sample = normalizeRowKeys(jsonData[0]);
                if (!sample.Question || !sample.Answer || !sample['Set'] || !sample['Set order']) {
                    setUploadError('File must include at least: Question, Answer, Set, and Set order columns.');
                    return;
                }

                processExcelData(jsonData);
            } catch (err) {
                console.error(err);
                setUploadError('Failed to process the file. Ensure it matches the template.');
            }
        };
        reader.onerror = () => setUploadError('Failed to read the file. Try again.');
        reader.readAsArrayBuffer(file);
    };

    const handleUploadToServer = async () => {
        if (!parsedData?.modules?.length) {
            setUploadError('No valid data to upload.');
            return;
        }
        setIsUploading(true);
        setUploadError('');

        try {
            // Upload each module → each set
            for (const mod of parsedData.modules) {
                for (const setEntry of mod.sets) {
                    if (!setEntry.questions.length) continue;
                    // Pass module code, set code, and order to your service
                    await uploadUserQuestions(
                        setEntry.questions,
                        mod.module,
                        setEntry.code,
                        setEntry.order
                    );
                }
            }
            setUploadSuccess(true);
            if (onUploadComplete) onUploadComplete();
            setTimeout(handleClose, 1500);
        } catch (err) {
            console.error(err);
            setUploadError('Upload failed. Please try again.');
            setIsUploading(false);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="me-2">
                <FaUpload className="me-2" />
                Upload Questions
            </Button>

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
                        />
                    </Form.Group>

                    {uploadError && <Alert variant="danger" className="mt-3">{uploadError}</Alert>}
                    {uploadSuccess && <Alert variant="success" className="mt-3">Upload successful!</Alert>}

                    {parsedData && (
                        <div className="mt-4">
                            <p>
                                <strong>{parsedData.questions.length}</strong> questions across{' '}
                                <strong>{parsedData.modules.length}</strong> modules found.
                            </p>
                            {parsedData.modules.map((mod) => (
                                <div key={mod.module} className="mb-3">
                                    <h6>Module: {mod.module}</h6>
                                    <p>Sets: {mod.sets.length}</p>
                                    <ul>
                                        {mod.sets.map((s) => (
                                            <li key={s.code}>
                                                {s.code} – {s.questions.length} questions (order {s.order})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isUploading}>
                        Close
                    </Button>
                    {parsedData && (
                        <Button
                            variant="primary"
                            onClick={handleUploadToServer}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload to Server'
                            )}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FileUploadModal;

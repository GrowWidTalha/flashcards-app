import React, { useEffect, useState } from "react";
import { 
  Table, Button, Form, Container, Row, Col, 
  Card, Badge, Accordion, InputGroup, Spinner, Alert
} from "react-bootstrap";
import {
  handleAdminFileUpload,
  handleAdminReplaceFileUpload,
} from "../handlers/fileHandlers";
import { fetchAllAdminQuestions } from "../handlers/apiHandlers";
import axios from "axios";
import { 
  FaFileUpload, FaFileExport, FaSync, FaSearch, 
  FaInfoCircle, FaListAlt, FaFilter, FaEye, FaEyeSlash,
  FaChevronDown, FaChevronUp, FaTrash, FaEdit
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({
    question: true,
    answer: true,
    setCode: true,
    category: true,
    difficulty: true
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const difficultyColors = {
    easy: "success",
    medium: "warning",
    hard: "danger"
  };

  const categoryColors = {
    "French Wine Questions": "purple",
    "Italian Wine Questions": "green",
    "Spanish Wine Questions": "red",
    "New World Wines": "orange"
  };

  const handleRefreshQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllAdminQuestions();
      console.log("Fetched questions:", data);
      setQuestions(data);
      setSuccess("Questions refreshed successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error refreshing questions:", error);
      setError("Failed to refresh questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://quizapp-backend-gold.vercel.app/api/admin/export",
        { responseType: "blob" }
      );

      if (response.status === 200) {
        const csvBlob = response.data;
        const csvUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement("a");
        link.href = csvUrl;
        link.download = `questions_export_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        URL.revokeObjectURL(csvUrl);
        setSuccess("Export completed successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(`Error: Unable to export questions. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error exporting questions:", error);
      setError("Error exporting questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (column) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const filteredQuestions = questions.filter(question => 
    Object.entries({
      question: question.question,
      answer: question.answer,
      setCode: question.setCode,
      category: question.category,
      subCategory1: question.subCategory1,
      subCategory2: question.subCategory2
    }).some(([key, value]) => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await fetchAllAdminQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please refresh the page.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <Container className="py-4 admin-panel">
      {/* Floating Action Button */}
      <motion.div 
        className="floating-action-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRefreshQuestions}
      >
        <FaSync className={loading ? "spin" : ""} />
      </motion.div>

      <Card className="shadow-lg border-0 mb-4 glass-card">
        <Card.Body className="p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <h3 className="fw-bold text-gradient mb-2">
                <FaListAlt className="me-2" />
                Question Management Dashboard
              </h3>
              <p className="text-muted mb-0">
                Total Questions: <Badge pill bg="primary" className="p-2">{questions.length}</Badge>
                {searchTerm && (
                  <span className="ms-2">
                    Filtered: <Badge pill bg="info" className="p-2">{filteredQuestions.length}</Badge>
                  </span>
                )}
              </p>
            </div>
            
            <Button 
              variant="outline-primary" 
              onClick={handleRefreshQuestions}
              className="mt-3 mt-md-0 refresh-btn"
              disabled={loading}
            >
              <FaSync className={loading ? "spin me-2" : "me-2"} /> 
              {loading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>

          {/* Status Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Row className="g-3 mb-4">
            <Col md={8}>
              <InputGroup className="search-bar">
                <InputGroup.Text className="bg-white">
                  <FaSearch className="text-primary" />
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search across all question fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
                <Button variant="outline-secondary">
                  <FaFilter className="me-2" /> Filters
                </Button>
              </InputGroup>
            </Col>
          </Row>

          <div className="d-flex flex-wrap gap-3 mb-4 action-buttons">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Form.Group controlId="uploadFile">
                <Form.Label className="btn btn-primary d-flex align-items-center upload-btn">
                  <FaFileUpload className="me-2" /> Upload Questions
                  <Form.Control
                    type="file"
                    accept=".csv, .xlsx"
                    hidden
                    onChange={(e) =>
                      handleAdminFileUpload(
                        e.target.files[0],
                        setLoading,
                        fetchAllAdminQuestions
                      )
                    }
                  />
                </Form.Label>
              </Form.Group>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Form.Group controlId="uploadReplaceFile">
                <Form.Label className="btn btn-outline-danger d-flex align-items-center replace-btn">
                  <FaFileUpload className="me-2" /> Replace All
                  <Form.Control
                    type="file"
                    accept=".csv, .xlsx"
                    hidden
                    onChange={(e) =>
                      handleAdminReplaceFileUpload(
                        e.target.files[0],
                        setLoading,
                        fetchAllAdminQuestions
                      )
                    }
                  />
                </Form.Label>
              </Form.Group>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="success"
                className="d-flex align-items-center export-btn"
                onClick={handleExportQuestions}
              >
                <FaFileExport className="me-2" /> Export to CSV
              </Button>
            </motion.div>
          </div>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5 loading-spinner">
          <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-primary">Loading questions...</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="shadow-lg border-0 glass-card">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0 table-custom">
                  <thead className="table-header">
                    <tr>
                      <th style={{ width: "5%" }}>#</th>
                      {selectedColumns.question && <th style={{ width: "25%" }}>Question</th>}
                      {selectedColumns.answer && <th style={{ width: "15%" }}>Answer</th>}
                      {selectedColumns.setCode && (
                        <th style={{ width: "10%" }}>
                          Set Code
                        </th>
                      )}
                      {selectedColumns.category && (
                        <th style={{ width: "15%" }}>
                          Category
                        </th>
                      )}
                      <th style={{ width: "10%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={Object.values(selectedColumns).filter(Boolean).length + 2} 
                            className="text-center text-muted py-4 no-results">
                          {searchTerm ? "No matching questions found" : "No questions available"}
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((question, index) => (
                        <React.Fragment key={question._id || index}>
                          <motion.tr 
                            whileHover={{ scale: 1.01 }}
                            className="table-row"
                          >
                            <td className="index-cell">{index + 1}</td>
                            {selectedColumns.question && (
                              <td className="text-truncate question-cell" style={{ maxWidth: "300px" }}>
                                {question.question || "N/A"}
                              </td>
                            )}
                            {selectedColumns.answer && (
                              <td className="text-truncate answer-cell" style={{ maxWidth: "200px" }}>
                                {question.answer || "N/A"}
                              </td>
                            )}
                            {selectedColumns.setCode && (
                              <td>
                                <Badge pill bg="info" className="set-code-badge">
                                  {question.setCode || "N/A"}
                                </Badge>
                              </td>
                            )}
                            {selectedColumns.category && (
                              <td>
                                <div className="category-tags">
                                  <Badge 
                                    pill 
                                    bg={categoryColors[question.category] || "secondary"} 
                                    className="category-badge"
                                  >
                                    {question.category || "N/A"}
                                  </Badge>
                                  {question.subCategory1 && (
                                    <Badge pill bg="light" text="dark" className="ms-1 subcategory-badge">
                                      {question.subCategory1}
                                    </Badge>
                                  )}
                                  {question.subCategory2 && (
                                    <Badge pill bg="light" text="dark" className="ms-1 subcategory-badge">
                                      {question.subCategory2}
                                    </Badge>
                                  )}
                                </div>
                              </td>
                            )}
                            <td className="action-buttons">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => setExpandedQuestion(expandedQuestion === question._id ? null : question._id)}
                                className="me-2 view-btn"
                              >
                                {expandedQuestion === question._id ? <FaEyeSlash /> : <FaEye />}
                              </Button>
                            </td>
                          </motion.tr>
                          {expandedQuestion === question._id && (
                            <tr>
                              <td colSpan={Object.values(selectedColumns).filter(Boolean).length + 2} 
                                  className="question-details">
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="p-3"
                                >
                                  <Row>
                                    <Col md={6}>
                                      <h6 className="detail-header">Question Details</h6>
                                      <div className="detail-content">
                                        <p className="fw-bold question-text">{question.question || "No question text"}</p>
                                        <p><strong>Answer:</strong> <span className="answer-text">{question.answer || "N/A"}</span></p>
                                        {question.moreInfo && (
                                          <div className="additional-info">
                                            <strong>Additional Info:</strong> 
                                            <div className="info-text">{question.moreInfo}</div>
                                          </div>
                                        )}
                                        {question.category && (
                                          <p className="category-description">
                                            <strong>Category Description:</strong> {question.category}
                                          </p>
                                        )}
                                      </div>
                                    </Col>
                                    <Col md={6}>
                                      <h6 className="detail-header">Metadata</h6>
                                      <div className="metadata-content">
                                        <div className="d-flex flex-wrap gap-2 mb-2 metadata-badges">
                                          {question.setCode && (
                                            <Badge pill bg="info" className="metadata-badge">
                                              Set: {question.setCode}
                                            </Badge>
                                          )}
                                          {question.setName && (
                                            <Badge pill bg="secondary" className="metadata-badge">
                                              {question.setName}
                                            </Badge>
                                          )}
                                          {question.serialNumber && (
                                            <Badge pill bg="light" text="dark" className="metadata-badge">
                                              Serial: {question.serialNumber}
                                            </Badge>
                                          )}
                                        </div>
                                        {question.setDescription && (
                                          <div className="set-description">
                                            <small className="text-muted">{question.setDescription}</small>
                                          </div>
                                        )}
                                        <div className="subcategories">
                                          {question.subCategory1 && (
                                            <div className="subcategory">
                                              <strong>Sub-category 1:</strong> {question.subCategory1}
                                            </div>
                                          )}
                                          {question.subCategory2 && (
                                            <div className="subcategory">
                                              <strong>Sub-category 2:</strong> {question.subCategory2}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      )}

      {/* Add some CSS for the creative elements */}
      <style jsx>{`
        .admin-panel {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          min-height: 100vh;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .text-gradient {
          background: linear-gradient(45deg, #3a7bd5, #00d2ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }
        .floating-action-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3a7bd5, #00d2ff);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 20px rgba(58, 123, 213, 0.3);
          cursor: pointer;
          z-index: 1000;
        }
        .search-bar {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border-radius: 50px;
          overflow: hidden;
        }
        .action-buttons .btn {
          border-radius: 50px;
          padding: 8px 20px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .upload-btn {
          background: linear-gradient(45deg, #4e54c8, #8f94fb);
          border: none;
        }
        .replace-btn {
          background: linear-gradient(45deg, #ff416c, #ff4b2b);
          color: white;
        }
        .export-btn {
          background: linear-gradient(45deg, #11998e, #38ef7d);
          border: none;
        }
        .refresh-btn {
          background: linear-gradient(45deg, #3a7bd5, #00d2ff);
          color: white;
          border: none;
        }
        .table-header {
          background: linear-gradient(45deg, #3a7bd5, #00d2ff);
          color: white;
        }
        .table-row:hover {
          background-color: rgba(58, 123, 213, 0.05);
        }
        .question-details {
          background: rgba(245, 247, 250, 0.8);
          border-left: 4px solid #3a7bd5;
        }
        .detail-header {
          color: #3a7bd5;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        .no-results {
          font-style: italic;
          color: #6c757d;
        }
        .loading-spinner {
          margin: 50px 0;
        }
        .category-badge {
          font-size: 0.8em;
          padding: 5px 10px;
        }
        .subcategory-badge {
          font-size: 0.7em;
          padding: 4px 8px;
        }
        .metadata-badge {
          font-size: 0.8em;
          padding: 5px 10px;
        }
        .view-btn:hover {
          background: #3a7bd5;
          color: white;
        }
        .edit-btn:hover {
          background: #ffc107;
          color: black;
        }
        .delete-btn:hover {
          background: #dc3545;
          color: white;
        }
      `}</style>
    </Container>
  );
};

export default AdminPanel;
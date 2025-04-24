import React from "react";
import {
    Button,
    ListGroup,
    Card,
    Badge,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import {
    FaRandom,
    FaStar,
    FaUpload,
    FaSearch,
    FaInfoCircle,
} from "react-icons/fa";
import "./Quiz.css";
import FileUploadModel from "./FileUploadModel";

const SetSelectionScreen = ({
    allSets,
    favorites,
    onLoadSet,
    onLoadRandomSet,
    onFileUpload,
}) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredSets = allSets.filter(
        (set) =>
            set.questions.length >= 5 && (
                set.setName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                set.setDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                set.setCode.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    return (
        <Container className="set-selection py-4">
            <Row className="justify-content-center mb-4">
                <Col md={8} className="text-center">
                    <h2 className="mb-3">Select a Question Set</h2>
                    <p className="text-muted">
                        Choose from available sets or upload your own
                    </p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <div className="search-box input-group mb-3">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search sets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-end">
                    <FileUploadModel
                        onFileUpload={onFileUpload}
                    />
                    <Button variant="outline-success" onClick={onLoadRandomSet}>
                        <FaRandom className="me-2" /> Random Set
                    </Button>
                </Col>
            </Row>

            {allSets.length > 0 ? (
                <Row>
                    <Col>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Available Sets</h5>
                                    <Badge pill bg="secondary">
                                        {filteredSets.length}{" "}
                                        {filteredSets.length === 1 ? "set" : "sets"}
                                    </Badge>
                                </div>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {filteredSets.length > 0 ? (
                                    filteredSets.map((set) => (
                                        <ListGroup.Item
                                            key={set.setCode}
                                            action
                                            onClick={() => onLoadSet(set.setCode)}
                                            className="py-3"
                                        >
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="me-3">
                                                    <div className="d-flex align-items-center mb-1">
                                                        <h6 className="mb-0 me-2">{set.setName}</h6>
                                                        {favorites.includes(set.setCode) && (
                                                            <FaStar className="text-warning" size={14} />
                                                        )}
                                                    </div>
                                                    <p className="text-muted small mb-1">
                                                        {set.setDescription || "No description available"}
                                                    </p>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        <Badge
                                                            pill
                                                            bg="light"
                                                            text="dark"
                                                            className="border"
                                                        >
                                                            {set.setCode}
                                                        </Badge>
                                                        {[
                                                            set.category,
                                                            set.subCategory1,
                                                            set.subCategory2,
                                                            set.subCategory3,
                                                            set.subCategory4,
                                                        ]
                                                            .filter(Boolean)
                                                            .map((cat, idx) => (
                                                                <Badge
                                                                    key={idx}
                                                                    pill
                                                                    bg="info"
                                                                    className="me-1"
                                                                >
                                                                    {cat}
                                                                </Badge>
                                                            ))}
                                                    </div>
                                                </div>
                                                <div className="text-nowrap">
                                                    <Badge pill bg="light" text="dark">
                                                        {set.questions.length} Qs
                                                    </Badge>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item className="text-center py-4">
                                        <FaSearch size={24} className="mb-2" />
                                        <h5>No sets found</h5>
                                        <p className="text-muted">Try a different search term</p>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col>
                        <Card className="text-center py-5 shadow-sm">
                            <FaInfoCircle size={48} className="text-muted mb-3" />
                            <h4>No question sets available</h4>
                            <p className="text-muted mb-4">
                                Upload a CSV or Excel file to get started
                            </p>
                            <label className="btn btn-primary">
                                <FaUpload className="me-2" /> Upload Your First Set
                                <input
                                    type="file"
                                    accept=".csv,.xlsx"
                                    hidden
                                    onChange={onFileUpload}
                                />
                            </label>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default SetSelectionScreen;

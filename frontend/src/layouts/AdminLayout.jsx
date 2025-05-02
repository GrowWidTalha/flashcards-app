import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaUsers, FaStar, FaExclamationTriangle, FaComments } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand as={NavLink} to="/admin">Admin Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="admin-navbar-nav" />
                    <Navbar.Collapse id="admin-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={NavLink} to="/admin" end>
                                <FaUsers className="me-2" />Home
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/users">
                                <FaUsers className="me-2" />Users
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/ratings">
                                <FaStar className="me-2" />Ratings
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/reports">
                                <FaExclamationTriangle className="me-2" />Complaints
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/feedback">
                                <FaComments className="me-2" />Feedback
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Outlet />
            </Container>
        </div>
    );
};

export default AdminLayout;

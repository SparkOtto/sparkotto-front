
import React from 'react';
import Navbar from './Navbar';
import { Col, Container, Row } from 'react-bootstrap';
import HeaderNavbar from './HeaderNavbar';
import { ToastContainer, toast } from 'react-toastify';

export default function Layout({ children }) {
    return (
        <>
            <Row className="mx-0">
                <Col md={12} lg={3} xl={3} xxl={3} className="px-0 bg-purple text-white height-navbar">
                    <Navbar />
                </Col>
                <Col md={12} lg={9} xl={9} xxl={9} className="px-0">
                    <HeaderNavbar />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    <Container fluid>
                        {children}
                    </Container>
                </Col>
            </Row>
        </>
    );
}   
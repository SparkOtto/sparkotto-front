
import React from 'react';
import Navbar from './Navbar';
import { Col, Container, Row } from 'react-bootstrap';
import HeaderNavbar from './HeaderNavbar';

export default function Layout({ children }) {
    return (
        <>
            <Row className="mx-0">
                <Col md={12} lg={3} xl={3} xxl={3} className="px-0 bg-purple text-white height-navbar">
                    <Navbar />
                </Col>
                <Col md={12} lg={9} xl={9} xxl={9} className="px-0">
                    <HeaderNavbar />
                    <Container fluid>
                        {children}
                    </Container>
                </Col>
            </Row>
        </>
    );
}   
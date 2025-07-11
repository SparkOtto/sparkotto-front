import React from 'react';
import Navbar from './Navbar';
import { Col, Container, Row } from 'react-bootstrap';
import HeaderNavbar from './HeaderNavbar';


export default function Layout({ children }) {
    return (
        <>
        <Row className="mx-0">
            <Col md={4} xl={2} xxl={2} className="px-0 bg-purple text-white min-vh-100">
                <Navbar />
            </Col>
            <Col md={8} xl={10} xxl={10} className="px-0">
                <HeaderNavbar />
                <Container>
                    {children}
                </Container>
            </Col>
        </Row>
        </>
    );
}   
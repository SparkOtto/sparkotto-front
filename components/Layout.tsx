import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Col, Container, Row } from 'react-bootstrap';


export default function Layout({ children }) {
    return (
        <>
        <Row className="mx-0">
            <Col md={4} xl={2} xxl={2} className="px-0">
                <Navbar />
            </Col>
            <Col md={8} xl={10} xxl={10} className="px-0">
                <Container>
                    {children}
                </Container>
            </Col>
        </Row>
        </>
    );
}   
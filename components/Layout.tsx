import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Container } from 'react-bootstrap';


export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <Container>
                {children}
            </Container>
            <Footer />
        </>
    );
}   
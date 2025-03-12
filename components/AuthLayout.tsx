import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';


export default function AuthLayout({ children }) {
    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100 vw-100 bg-purple">
                {children}
            </div>
            <Footer />
        </>
    );
}   
import React from 'react';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function AuthLayout({ children }) {
    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-purple">
                {children}
                <Footer />
            </div>
        </>
    );
}   
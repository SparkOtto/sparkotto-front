import React from 'react';
import Footer from './Footer';


export default function AuthLayout({ children }) {
    return (
        <>
            <div className="vh-100 bg-purple d-flex flex-column justify-content-between align-items-center">
                <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                    {children}
                </div>
                <Footer />
            </div>
        </>
    );
}   
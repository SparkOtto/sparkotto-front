import React from 'react';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';


export default function AuthLayout({ children }) {
    return (
        <>
            <div className="vh-100 bg-purple d-flex flex-column justify-content-between align-items-center">
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
                <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                    {children}
                </div>
                <Footer />
            </div>
        </>
    );
}   
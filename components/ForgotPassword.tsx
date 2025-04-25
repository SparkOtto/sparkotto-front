import React from 'react';
import { Form, Button, Tab, Tabs, Row, Col } from 'react-bootstrap';
import Logo from './Logo';
import Link from 'next/link';

export default function ForgotPassword() {
  return (
    <div className="d-inline-flex flex-column align-items-center justify-content-center">
      <Logo />
      <div className="bg-white p-5 rounded shadow m-5 authForm">
        <Form className='w-100'>
            <Link href="/" passHref className='text-dark'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="currentColor" className="w-5 h-5 mb-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </Link>
            <h4 className="fw-bold">Mot de passe oublié</h4>
            <p className="text-muted">Entrez votre adresse courriel ou numéro de téléphone pour réinitialiser votre mot de passe</p>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Button variant="yellow" className="w-100 bg-yellow border-0 fw-bold">
              Réinitialiser mon mot de passe
            </Button>
          </Form>
      </div >
    </div >
  );
}
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import Logo from '../components/Logo';
import { ToastContainer, toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Un email de réinitialisation vous a été envoyé si ce compte existe.');
      } else {
        toast.error(data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      toast.error('Erreur réseau, veuillez réessayer.');
    }
  };

  return (
    <div className="d-inline-flex flex-column align-items-center justify-content-center">
      <Logo />
      <div className="bg-white p-5 rounded shadow m-5 authForm">
        <Form className='w-100' onSubmit={handleSubmit}>
          <Link href="/" passHref className='text-dark'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="w-5 h-5 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h4 className="fw-bold">Mot de passe oublié</h4>
          <p className="text-muted">Entrez votre adresse courriel ou numéro de téléphone pour réinitialiser votre mot de passe</p>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="yellow" className="w-100 bg-yellow border-0 fw-bold" type="submit">
            Réinitialiser mon mot de passe
          </Button>
          {message && <p className="mt-3 text-center">{message}</p>}
        </Form>
      </div>
    </div>
  );
}

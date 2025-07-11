import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Logo from './Logo';
import Link from 'next/link';

export default function DoubleAuth() {
  const [code, setCode] = useState('');

  const handleChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3) + ' – ' + value.slice(3, 6);
    }
    setCode(value);
  };

  return (
    <div className="d-inline-flex flex-column align-items-center justify-content-center vh-100 bg-purple">
      <Logo />
      <div className="bg-white p-5 rounded shadow m-5 authForm text-left">
        <Form className='w-100'>
          <Link href="/" passHref className='text-dark d-block text-start mb-3'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h4 className="fw-bold">Entrez le code 2FA envoyé à votre mobile</h4>
          <p className="text-muted">Numéro de téléphone mobile se terminant par **332</p>
          <Form.Group className="mb-3">
            <Form.Control 
              type="text" 
              placeholder="* * * – * * *" 
              className="text-center fs-4 fw-bold p-3 border rounded" 
              style={{ letterSpacing: '5px' }}
              value={code}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="text-start">
            <Link href="/auth/forgot-password" className="text-muted">Renvoyer le code</Link>
          </div>
          <Button variant="warning" className="w-100 mt-3 fw-bold text-dark">
            Envoyer
          </Button>
        </Form>
      </div>
    </div>
  );
}

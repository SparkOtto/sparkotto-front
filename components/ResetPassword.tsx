import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';
import { ToastContainer, toast } from 'react-toastify';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; // Récupération du token de reset dans l'URL

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setMessage('Token de réinitialisation manquant.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword : password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.');
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
          <h4 className="fw-bold">Réinitialiser le mot de passe</h4>
          <p className="text-muted">Entrez votre nouveau mot de passe</p>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Nouveau mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirmez le mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="yellow" className="w-100 bg-yellow border-0 fw-bold" type="submit" disabled={!token}>
            Réinitialiser le mot de passe
          </Button>
        </Form>
      </div>
    </div>
  );
}

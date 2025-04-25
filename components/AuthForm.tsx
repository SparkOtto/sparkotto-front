'use server';

import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from './Logo';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'


export default function AuthForm() {
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = (event.target as any).formBasicEmail.value;
    const password = (event.target as any).formBasicPassword.value;

    try {
      const response = await fetch('http://192.168.167.89:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        if(response.status === 500){
          toast.error(data.message);
          return;
        }
      } else{
        const data = await response.json();
        const token = data.token;
        const user = data.user;

        Cookies.set('token', token, { expires: 7, secure: true });
        Cookies.set('user', JSON.stringify(user), { expires: 7 });

        toast.success('Connexion réussie!');

        router.push('/dashboard');

        toast.success('Connexion réussie!');
      }

    } catch (error) {
      toast.error('Erreur lors de la connexion.');
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const first_name = (event.target as any).formBasicFirstName.value;
    const last_name = (event.target as any).formBasicLastName.value;
    const email = (event.target as any).formBasicEmail.value;
    const phone_number = (event.target as any).formBasicPhone.value;
    const password = (event.target as any).formBasicPassword.value;

    try {
      const response = await fetch(`http://192.168.167.89:3001/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          phone_number,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      toast.success('Inscription réussie!');
    } catch (error) {
      toast.error('Erreur lors de l\'inscription.');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <Logo />
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
      <div className="bg-white p-5 rounded shadow m-5 authForm">
        <Tabs defaultActiveKey="connexion" className="mb-3">
          <Tab eventKey="connexion" title={<span className="fw-bold">Connexion</span>}>
            <Form className="w-100" onSubmit={handleLogin}>
              <h4 className="fw-bold">Bienvenue</h4>
              <p className="text-muted">Veuillez entrer vos identifiants.</p>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" />
              </Form.Group>
              <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                <Form.Check type="checkbox" label="Rester connecté" />
                <Link href="/auth/forgot-password" className="text-muted">
                  Mot de passe oublié ?
                </Link>
              </Form.Group>
              <Button type="submit" variant="yellow" className="w-100 border-0 fw-bold mt-2">
                Connexion
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="inscription" title="Inscription">
            <Form className="w-100" onSubmit={handleRegister}>
              <h4 className="fw-bold">Bienvenue</h4>
              <p className="text-muted">Veuillez vous inscrire.</p>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control type="text" placeholder="Prénom" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control type="text" placeholder="Nom" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicPhone">
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control type="tel" placeholder="Téléphone" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" />
              </Form.Group>

              <Button type="submit" variant="yellow" className="w-100 bg-yellow border-0 fw-bold mt-3">
                Inscription
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
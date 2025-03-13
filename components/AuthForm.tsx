import React from 'react';
import { Form, Button, Tab, Tabs, Row, Col } from 'react-bootstrap';
import Logo from './Logo';
import Link from 'next/link';

export default function AuthForm() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <Logo />
      <div className="bg-white p-5 rounded shadow m-5 authForm">
        <Tabs defaultActiveKey="connexion" className="mb-3">
          <Tab eventKey="connexion" title={<span className="fw-bold">Connexion</span>}>
            <Form className='w-100'>
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
                <Link href="/auth/forgot-password" className="text-muted">Mot de passe oublié ?</Link>
              </Form.Group>
              <Button variant="yellow" className="w-100 bg-yellow border-0 fw-bold mt-2">
                Connexion
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="inscription" title="Inscription">
            <Form className='w-100'>
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

                <Button variant="yellow" className="w-100 bg-yellow border-0 fw-bold mt-3">
                  Inscription
                </Button>
            </Form>
          </Tab>
        </Tabs>
      </div >
    </div >
  );
}
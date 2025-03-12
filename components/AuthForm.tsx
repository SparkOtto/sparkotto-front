import React from 'react';
import { Form, Button, Tab, Tabs } from 'react-bootstrap';
import Logo from './Logo';

export default function AuthForm() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <Logo />
      <div className="bg-white p-5 rounded shadow m-5 w-100">
        <Tabs defaultActiveKey="connexion" className="mb-3">
          <Tab eventKey="connexion" title={<span className="fw-bold">Connexion</span>}></Tab>
          <Tab eventKey="inscription" title="Inscription" disabled></Tab>  
        </Tabs>
        <Form>
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
            <a href="#" className="text-muted">Mot de passe oublié ?</a>
          </Form.Group>
          <Button variant="yellow" className="w-100 bg-yellow border-0 fw-bold">
            Connexion
          </Button>
        </Form>
      </div>
    </div>
  );
}
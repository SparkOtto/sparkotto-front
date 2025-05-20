import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

export default function Profile() {
    const [user, setUser] = useState({ first_name: '', last_name: '', email: '', phone_number: '', id: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    const handleSavePassword = () => {
        const currentPassword = currentPasswordRef.current?.value;
        const newPassword = newPasswordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Veuillez remplir tous les champs.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        const changePassword = async () => {
            try {
                const response = await fetch(`${process.env.backendAPI}/api/user/change-password/${user.id}`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ oldPassword: currentPassword, newPassword: newPassword }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    if (response.status === 401) {
                        toast.error(data.message);
                        return;
                    }
                    throw new Error(data.message);
                }
            } catch (error) {

                toast.error(`${error}`);
            }
        };

        changePassword();
    };

    return (
        <Layout>
            <div className="container py-4">
                <h2 className="mb-4">Mon Profil</h2>
                <Card className="p-4 mb-4">
                    <Card.Body>
                        <Form>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="first_name">
                                        <Form.Label>Prénom</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="first_name"
                                            value={user.first_name}
                                            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="last_name">
                                        <Form.Label>Nom</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="last_name"
                                            value={user.last_name}
                                            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="phone_number">
                                        <Form.Label>Téléphone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone_number"
                                            value={user.phone_number}
                                            onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end">
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="secondary"
                                            className="me-2"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Annuler
                                        </Button>
                                        <Button variant="yellow" onClick={() => setIsEditing(false)}>
                                            Enregistrer
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="warning" onClick={() => setIsEditing(true)}>
                                        Modifier
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Encars de changement de mot de passe */}

                <Card className="p-4 mb-4">
                    <Card.Body>
                        <h5>Changer le mot de passe</h5>
                        <Form>
                            <Form.Group controlId="current_password" className="mb-3">
                                <Form.Label>Mot de passe actuel</Form.Label>
                                <Form.Control type="password" ref={currentPasswordRef} />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="new_password" className="mb-3">
                                        <Form.Label>Nouveau mot de passe</Form.Label>
                                        <Form.Control type="password" ref={newPasswordRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="confirm_password" className="mb-3">
                                        <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                                        <Form.Control type="password" ref={confirmPasswordRef} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="yellow" onClick={handleSavePassword}>
                                Enregistrer
                            </Button>
                        </div>
                    </Card.Body>
                </Card>

                {/* Gestion de profil */}
                <Card className="p-4">
                    <Card.Body>
                        <h5>Gestion de profil</h5>
                        <Button
                            variant="danger"
                            className="mt-3"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Supprimer mon compte
                        </Button>
                    </Card.Body>
                </Card>

                {/* Modal de confirmation de suppression */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmer la suppression</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={() => setShowDeleteModal(false)}>
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </Layout>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Profile() {
    const [user, setUser] = useState({ first_name: '', last_name: '', email: '', phone_number: '', id: '' });
    const [isEditing, setIsEditing] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);


    const handleSaveProfile = () => {
        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;
        const email = emailRef.current?.value;
        const phoneNumber = phoneRef.current?.value;

        if (!firstName || !lastName || !email || !phoneNumber) {
            toast.error('Veuillez remplir tous les champs.');
            return;
        }

        const updateProfile = async () => {
            try {
                const response = await fetch(`${process.env.backendAPI}/api/user/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email, phone_number: phoneNumber }),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour du profil.');
                }

                const data = await response.json();
                toast.success('Profil mis à jour avec succès.');
                setUser({ ...user, first_name: firstName, last_name: lastName, email: email, phone_number: phoneNumber });
                Cookies.set('user', JSON.stringify({ ...user, first_name: firstName, last_name: lastName, email: email, phone_number: phoneNumber }), { expires: 1 });
                setIsEditing(false);

            } catch (error) {
                toast.error(`${error}`);
            }
        };

        updateProfile();
    };


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
                    body: JSON.stringify({ oldPassword: currentPassword, newPassword: newPassword, confirmPassword: confirmPassword }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    if (response.status === 401) {
                        toast.error(data.message);
                        return;
                    }
                    throw new Error(data.message);
                }

                const data = await response.json();
                toast.success(data.message);

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
                                            defaultValue={user.first_name}
                                            ref={firstNameRef}
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
                                            defaultValue={user.last_name}
                                            ref={lastNameRef}
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
                                            defaultValue={user.email}
                                            ref={emailRef}
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
                                            defaultValue={user.phone_number}
                                            ref={phoneRef}
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
                                        <Button variant="yellow" onClick={() => handleSaveProfile()}>
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
                                <div className="position-relative">
                                    <Form.Control
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        ref={currentPasswordRef}
                                    />
                                    <Button
                                        variant="link"
                                        className="position-absolute top-50 end-0 translate-middle-y"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                    </Button>
                                </div>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="new_password" className="mb-3">
                                        <Form.Label>Nouveau mot de passe</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showNewPassword ? 'text' : 'password'}
                                                ref={newPasswordRef}
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute top-50 end-0 translate-middle-y"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="confirm_password" className="mb-3">
                                        <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                ref={confirmPasswordRef}
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute top-50 end-0 translate-middle-y"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </div>
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
            </div>
        </Layout>
    );
}

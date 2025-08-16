import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../../components/Layout';
import { Card, Button, Form, Row, Col, Table, Container, Modal } from 'react-bootstrap';
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';

export default function Page() {
    const router = useRouter();

    // Fetch all agencies
    const getAllAgencies = async () => {
        try {
            const response = await fetch(`${process.env.backendAPI}/api/agency`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 500) {
                    console.error('Server error:', data.message);
                    return;
                }
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching agencies:', error);
        }
    };

    const [agencies, setAgencies] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    // Refs pour les inputs
    const cityRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);
    const streetRef = useRef<HTMLInputElement>(null);
    const additionalInfoRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const headOfficeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAgencies = async () => {
            const data = await getAllAgencies();
            if (data) {
                setAgencies(data);
            }
        };
        fetchAgencies();
    }, []);

    const handleAddAgency = async () => {
        try {
            const agencyToAdd = {
                city: cityRef.current?.value || '',
                postal_code: parseInt(postalCodeRef.current?.value || '0', 10),
                street: streetRef.current?.value || '',
                additional_info: additionalInfoRef.current?.value || '',
                phone: phoneRef.current?.value || '',
                head_office: headOfficeRef.current?.checked || false,
            };

            const response = await fetch(`${process.env.backendAPI}/api/agency`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agencyToAdd),
            });

            if (response.ok) {
                const addedAgency = await response.json();
                setAgencies([...agencies, addedAgency]);
                setShowModal(false);

                // Reset des champs
                if (cityRef.current) cityRef.current.value = '';
                if (postalCodeRef.current) postalCodeRef.current.value = '';
                if (streetRef.current) streetRef.current.value = '';
                if (additionalInfoRef.current) additionalInfoRef.current.value = '';
                if (phoneRef.current) phoneRef.current.value = '';
                if (headOfficeRef.current) headOfficeRef.current.checked = false;

                toast.success('Agence ajoutée avec succès !');
            } else {
                const errorData = await response.json();
                toast.error('Erreur lors de l\'ajout de l\'agence : ' + errorData.message);
                console.error('Failed to add agency:', errorData.message);
            }
        } catch (error) {
            console.error('Error adding agency:', error);
        }
    };

    // Suppression d'une agence individuellement
    const handleDeleteAgency = async (agencyId: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette agence ?")) return;
        try {
            const response = await fetch(`${process.env.backendAPI}/api/agency/${agencyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const updatedAgencies = await getAllAgencies();
                if (updatedAgencies) {
                    setAgencies(updatedAgencies);
                }
                toast.success('Agence supprimée avec succès');
            } else {
                const deletedAgency = await response.json();
                toast.error('Erreur lors de la suppression de l\'agence : ' + deletedAgency.message);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    return (
        <Layout>
            <Container fluid>
                <h1 className="mb-4">Gestion des agences :</h1>
                <p className="mb-5 text-secondary fs-5">Gérez les agences de votre réseau ici.</p>
                <div className="mb-4">
                    <Row className="w-100 justify-content-between align-items-center">
                        <Col xs={6} className="d-flex align-items-center flex-nowrap mb-3">
                            <h4 className="fs-2">Toutes les agences</h4>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-end align-items-center flex-nowrap mb-3">
                            <Button variant="primary" className='text-light' onClick={() => setShowModal(true)}>
                                <FaPlus className="me-2" />
                                Ajouter une agence
                            </Button>
                        </Col>
                        <Col xs={12} className="d-flex flex-wrap gap-3 mb-4 dashboard-cards-row">
                            <Card className="dashboard-card dashboard-card-dark flex-grow-1">
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="dashboard-card-title">Total Agences</span>
                                    </div>
                                    <div className="dashboard-card-value mt-2">{agencies.length}</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <div className="table-container">
                                <table className="sparkotto-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Ville</th>
                                            <th>Code Postal</th>
                                            <th>Rue</th>
                                            <th>Complément</th>
                                            <th>Téléphone</th>
                                            <th>Siège</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agencies.map((agency, index) => (
                                            <tr
                                                key={index}
                                                onClick={(e) => {
                                                    if ((e.target as HTMLInputElement).type !== 'checkbox' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                                                        router.push(`/admin/agency/${agency.id_agency}/detail/`);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td><a href="#">{`AG${agency.id_agency}`}</a></td>
                                                <td>{agency.city}</td>
                                                <td>{agency.postal_code}</td>
                                                <td>{agency.street}</td>
                                                <td>{agency.additional_info}</td>
                                                <td>{agency.phone}</td>
                                                <td>{agency.head_office ? 'Oui' : 'Non'}</td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleDeleteAgency(agency.id_agency);
                                                        }}
                                                        title="Supprimer cette agence"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            {/* Modal for adding an agency */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-purple text-light">
                    <Modal.Title>Ajouter une agence</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="gy-3">
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Ville</Form.Label>
                                    <Form.Control type="text" placeholder="Entrez la ville" ref={cityRef} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Code Postal</Form.Label>
                                    <Form.Control type="text" placeholder="Entrez le code postal" ref={postalCodeRef} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Rue</Form.Label>
                                    <Form.Control type="text" placeholder="Entrez la rue" ref={streetRef} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Complément</Form.Label>
                                    <Form.Control type="text" placeholder="Entrez le complément d'adresse" ref={additionalInfoRef} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Téléphone</Form.Label>
                                    <Form.Control type="text" placeholder="Entrez le téléphone" ref={phoneRef} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} className="d-flex align-items-center mt-4">
                                <Form.Check type="checkbox" label="Siège" ref={headOfficeRef} />
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="yellow" onClick={handleAddAgency}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
}

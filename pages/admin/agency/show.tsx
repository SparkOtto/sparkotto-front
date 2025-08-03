import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { Card, Button, Form, Row, Col, FormControl, Table, Dropdown, Container, Modal } from 'react-bootstrap';
import { FaRecycle, FaSearch } from 'react-icons/fa';
import { FaArrowsRotate, FaFilter, FaPlus, FaTrash } from "react-icons/fa6";
import { useRouter } from 'next/router';
import { cp } from 'fs';
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
    const [newAgency, setNewAgency] = useState({
        city: '',
        postal_code: '',
        street: '',
        additional_info: '',
        phone: '',
        head_office: false,
    });

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
            // Ensure postal_code is an integer
            const agencyToAdd = {
                ...newAgency,
                postal_code: parseInt(newAgency.postal_code, 10) || 0,
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
                setNewAgency({
                    city: '',
                    postal_code: '',
                    street: '',
                    additional_info: '',
                    phone: '',
                    head_office: false
                });
                toast.success('Agence ajoutée avec succès !');
            } else {
                console.log(response);
                const addedAgency = await response.json();
                toast.error('Erreur lors de l\'ajout de l\'agence : ' + addedAgency.message);
                console.error('Failed to add agency:', addedAgency.message);
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
                // Optionally, re-fetch agencies from backend to ensure sync
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
                            <h4 className="fs-2 fs-sm-3 fs-md-4 fs-lg-5 fs-xl-6">
                                Toutes les agences
                            </h4>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-end align-items-center flex-nowrap mb-3">
                            <Button variant="primary" className='text-light' onClick={() => setShowModal(true)}>
                                <FaPlus className="me-2" />
                                Ajouter une agence
                            </Button>
                        </Col>
                        <Col xs={12} className="d-flex flex-wrap gap-3 mb-4 dashboard-cards-row">
                            {[
                                { title: "Total Agences", value: agencies.length, className: "dashboard-card-dark" },
                                // Add more stats if needed
                            ].map((stat, index) => (
                                <Card
                                    key={index}
                                    className={`dashboard-card ${stat.className} flex-grow-1`}
                                >
                                    <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="dashboard-card-title">{stat.title}</span>
                                        </div>
                                        <div className="dashboard-card-value mt-2">{stat.value}</div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>
                        <Col xs={12} className="d-flex flex-wrap">
                            <Form className="d-flex me-2 mb-2 w-100">
                                <div className="position-relative w-100">
                                    <FormControl
                                        type="search"
                                        placeholder="Rechercher"
                                        className="py-3 pe-5 rounded-lg w-100"
                                        aria-label="Search"
                                    />
                                    <FaSearch
                                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary"
                                    />
                                </div>
                            </Form>
                        </Col>
                        <Col xs={12} className="d-flex justify-content-end align-items-center flex-wrap gap-2">
                            <Button variant="secondary" className="me-2">
                                <FaArrowsRotate className="me-0 me-lg-2" />
                                <span className="d-lg-inline d-none">Annuler</span>
                            </Button>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" id="dropdown-filter">
                                    <FaFilter className="me-0 me-lg-2" />
                                    <span className="d-lg-inline d-none">Filtre</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#">Nom A-Z</Dropdown.Item>
                                    <Dropdown.Item href="#">Nom Z-A</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#">Ville A-Z</Dropdown.Item>
                                    <Dropdown.Item href="#">Ville Z-A</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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
                                    <Form.Control
                                        type="text"
                                        value={newAgency.city}
                                        onChange={(e) => setNewAgency({ ...newAgency, city: e.target.value })}
                                        placeholder="Entrez la ville"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Code Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newAgency.postal_code}
                                        onChange={(e) => setNewAgency({ ...newAgency, postal_code: e.target.value })}
                                        placeholder="Entrez le code postal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Rue</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newAgency.street}
                                        onChange={(e) => setNewAgency({ ...newAgency, street: e.target.value })}
                                        placeholder="Entrez la rue"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Complément</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newAgency.additional_info}
                                        onChange={(e) => setNewAgency({ ...newAgency, additional_info: e.target.value })}
                                        placeholder="Entrez le complément d'adresse"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Téléphone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newAgency.phone}
                                        onChange={(e) => setNewAgency({ ...newAgency, phone: e.target.value })}
                                        placeholder="Entrez le téléphone"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} className="d-flex align-items-center mt-4">
                                <Form.Check
                                    type="checkbox"
                                    label="Siège"
                                    checked={newAgency.head_office}
                                    onChange={(e) => setNewAgency({ ...newAgency, head_office: e.target.checked })}
                                />
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

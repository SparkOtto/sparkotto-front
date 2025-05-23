import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { Card, Button, Form, Row, Col, FormControl, Table, Dropdown, Container, Modal } from 'react-bootstrap';
import { FaArrowCircleUp, FaRecycle, FaSearch } from 'react-icons/fa';
import { FaArrowsRotate, FaFilter, FaPlus, FaAlignJustify } from "react-icons/fa6";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Page() {

    const router = useRouter();

    const getAllVehicles = async () => {
        const simulatedData = [
            { make: 'Tesla', model: 'Model S', year: 2022, registration: 'TES123', available: true, fuel: 'Electrique' },
            { make: 'BMW', model: 'X5', year: 2021, registration: 'BMW456', available: false, fuel: 'Essence' },
            { make: 'Audi', model: 'A4', year: 2020, registration: 'AUD789', available: true, fuel: 'Hybrid' },
            { make: 'Mercedes', model: 'C-Class', year: 2019, registration: 'MER321', available: false, fuel: 'Diesel' },
            { make: 'Volkswagen', model: 'Golf', year: 2023, registration: 'VW654', available: true, fuel: 'Hybrid' },
        ];
        return simulatedData;
    };

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '', registration: '', available: false, fuel: '' });

    React.useEffect(() => {
        const fetchVehicles = async () => {
            const data = await getAllVehicles();
            if (data) {
                setVehicles(data);
            }
        };
        fetchVehicles();
    }, []);

    const handleAddVehicle = () => {
        setVehicles([...vehicles, { ...newVehicle, year: parseInt(newVehicle.year) }]);
        setShowModal(false);
        setNewVehicle({ make: '', model: '', year: '', registration: '', available: false, fuel: '' });
    };

    return (
        <Layout>
            <Container fluid>
                <h1 className="mb-4">Gestion des véhicules:</h1>
                <p className="mb-5 text-secondary fs-5">Gérez les véhicules de votre flotte ici.</p>
                <div className="mb-4">
                    <Row className="w-100 justify-content-between align-items-center">
                        {/* Liste des véhicules */}

                        <Col xs={6} className="d-flex align-items-center flex-nowrap mb-3">
                            <h4 className="fs-2 fs-sm-3 fs-md-4 fs-lg-5 fs-xl-6">
                                Tous les véhicules
                            </h4>
                        </Col>

                        <Col xs={6} className="d-flex justify-content-end align-items-center flex-nowrap mb-3">
                            <Button variant="danger" className="me-1">
                                <FaRecycle className="me-0 me-lg-2" />
                                <span className="d-lg-inline d-none">Supprimer</span>
                            </Button>
                            <Button variant="primary" className='text-light' onClick={() => setShowModal(true)}>
                                <FaPlus className="me-2" />
                                Ajouter un véhicule
                            </Button>
                        </Col>


                        <Col xs={12} className="d-flex flex-wrap gap-3 mb-4 dashboard-cards-row">
                            {[
                                { title: "Total Véhicules", value: vehicles.length, className: "dashboard-card-dark" },
                                { title: "Disponibles", value: vehicles.filter(v => v.available).length || 0, className: "dashboard-card-light" },
                                { title: "Ecologiques 🍃", value: vehicles.filter(v => v.fuel === 'Electrique' || v.fuel === 'Hybrid').length || 0, className: "dashboard-card-light" },
                            ].map((stat, index) => (
                                <Card
                                    key={index}
                                    className={`dashboard-card ${stat.className} flex-grow-1`}
                                >
                                    <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="dashboard-card-title">{stat.title}</span>
                                            {/* <span className="dashboard-card-dots">•••</span> */}
                                        </div>
                                        <div className="dashboard-card-value mt-2">{stat.value}</div>
                                        {/* <div className="dashboard-card-change">+X%</div> */}
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
                                    <Dropdown.Item href="#">Marque A-Z</Dropdown.Item>
                                    <Dropdown.Item href="#">Marque Z-A</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#">Année croissante</Dropdown.Item>
                                    <Dropdown.Item href="#">Année décroissante</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs={12}>
                            <div className="table-container">
                                <table className="sparkotto-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>ID VEH</th>
                                            <th>Année</th>
                                            <th>Marque</th>
                                            <th>Model</th>
                                            <th>Disponible</th>
                                            <th>Carburant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((vehicle, index) => (
                                            <tr
                                                key={index}
                                                onClick={(e) => {
                                                    if (e.target.type !== 'checkbox') {
                                                        router.push(`/admin/vehicle/${index + 1}/detail/`);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td> <input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                                                <td><a href="#">{`SPK${index + 1}`}</a></td>
                                                <td>{vehicle.year}</td>
                                                <td>{vehicle.make}</td>
                                                <td>{vehicle.model}</td>
                                                <td>{vehicle.available ? 'Oui' : 'Non'}</td>
                                                <td>{vehicle.fuel}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            {/* Modal for adding a vehicle */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un véhicule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Marque</Form.Label>
                            <Form.Control
                                type="text"
                                value={newVehicle.make}
                                onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Modèle</Form.Label>
                            <Form.Control
                                type="text"
                                value={newVehicle.model}
                                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Année</Form.Label>
                            <Form.Control
                                type="number"
                                value={newVehicle.year}
                                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Immatriculation</Form.Label>
                            <Form.Control
                                type="text"
                                value={newVehicle.registration}
                                onChange={(e) => setNewVehicle({ ...newVehicle, registration: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Disponible"
                                checked={newVehicle.available}
                                onChange={(e) => setNewVehicle({ ...newVehicle, available: e.target.checked })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" className='text-light' onClick={handleAddVehicle}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
}

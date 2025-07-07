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
        try {
            const response = await fetch(`${process.env.backendAPI}/api/vehicles`, {
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
                return data; // Return the user data
            }

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ brand: '', model: '', fuelTypeId: '', license_plate: '', mileage: '', seat_count: '', fuel_capacity: '', transmissionId: '' });

    React.useEffect(() => {
        const fetchVehicles = async () => {
            const data = await getAllVehicles();
            if (data) {
                setVehicles(data);
            }
        };
        fetchVehicles();
    }, []);

    const handleAddVehicle = async () => {
        try {
            const response = await fetch(`${process.env.backendAPI}/api/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newVehicle, year: parseInt(newVehicle.year) }),
            });

            console.log(response);

            if (response.ok) {
                const addedVehicle = await response.json();
                setVehicles([...vehicles, addedVehicle]);
                setShowModal(false);
                setNewVehicle({ brand: '', model: '', fuelTypeId: '', license_plate: '', mileage: '', seat_count: '', fuel_capacity: '', transmissionId: '' });
            } else {
                console.error('Failed to add vehicle:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
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
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-purple text-light">
                    <Modal.Title>Ajouter un véhicule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="gy-3">
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Marque</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newVehicle.brand}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                                        placeholder="Entrez la marque"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Modèle</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newVehicle.model}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                                        placeholder="Entrez le modèle"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Immatriculation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newVehicle.license_plate}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                                        placeholder="Entrez l'immatriculation"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Kilométrage</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newVehicle.mileage}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
                                        placeholder="Entrez le kilométrage"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Nombre de sièges</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newVehicle.seat_count}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, seat_count: e.target.value })}
                                        placeholder="Entrez le nombre de sièges"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Capacité du réservoir</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newVehicle.fuel_capacity}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, fuel_capacity: e.target.value })}
                                        placeholder="Entrez la capacité (litres)"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Transmission</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newVehicle.transmissionId}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, transmissionId: e.target.value })}
                                        placeholder="Entrez la transmission"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Type de carburant</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newVehicle.fuelTypeId}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, fuelTypeId: e.target.value })}
                                        placeholder="Entrez le type de carburant"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="yellow" onClick={handleAddVehicle}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
}

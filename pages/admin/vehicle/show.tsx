import React, { useRef, useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { Card, Button, Form, Row, Col, FormControl, Dropdown, Container, Modal } from 'react-bootstrap';
import { FaArrowCircleUp, FaRecycle, FaSearch } from 'react-icons/fa';
import { FaArrowsRotate, FaFilter, FaPlus, FaAlignJustify, FaTrash } from "react-icons/fa6";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {
    const router = useRouter();

    // Refs for modal form fields
    const brandRef = useRef<HTMLInputElement>(null);
    const modelRef = useRef<HTMLInputElement>(null);
    const licensePlateRef = useRef<HTMLInputElement>(null);
    const mileageRef = useRef<HTMLInputElement>(null);
    const seatCountRef = useRef<HTMLInputElement>(null);
    const fuelCapacityRef = useRef<HTMLInputElement>(null);
    const transmissionIdRef = useRef<HTMLSelectElement>(null);
    const fuelTypeIdRef = useRef<HTMLSelectElement>(null);
    const availableRef = useRef<HTMLInputElement>(null);

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [fuelTypes, setFuelTypes] = useState<any[]>([]);
    const [transmissions, setTransmissions] = useState<any[]>([]);

    // Fetch all vehicles
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
                return data;
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    // Fetch all fuel types
    const getAllFuelTypes = async () => {
        try {
            const response = await fetch(`${process.env.backendAPI}/api/fueltype`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setFuelTypes(data);
            }
        } catch (error) {
            console.error('Error fetching fuel types:', error);
        }
    };

    // Fetch all transmissions
    const getAllTransmissions = async () => {
        try {
            const response = await fetch(`${process.env.backendAPI}/api/transmission`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setTransmissions(data);
            }
        } catch (error) {
            console.error('Error fetching transmissions:', error);
        }
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            const data = await getAllVehicles();
            if (data) setVehicles(data);
        };
        fetchVehicles();
        getAllFuelTypes();
        getAllTransmissions();
    }, []);

    // Add vehicle using refs (no rerender on input)
    const handleAddVehicle = async () => {
        const newVehicle = {
            brand: brandRef.current?.value || '',
            model: modelRef.current?.value || '',
            license_plate: licensePlateRef.current?.value || '',
            mileage: mileageRef.current?.value || '',
            seat_count: seatCountRef.current?.value || '',
            fuel_capacity: fuelCapacityRef.current?.value || '',
            transmissionId: transmissionIdRef.current?.value ? Number(transmissionIdRef.current.value) : null,
            fuelTypeId: fuelTypeIdRef.current?.value ? Number(fuelTypeIdRef.current.value) : null,
            available: availableRef.current?.checked || false,
        };

        try {
            const response = await fetch(`${process.env.backendAPI}/api/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVehicle),
            });

            if (response.ok) {
                const addedVehicle = await response.json();
                setVehicles([...vehicles, addedVehicle]);
                setShowModal(false);

                // Reset refs
                if (brandRef.current) brandRef.current.value = '';
                if (modelRef.current) modelRef.current.value = '';
                if (licensePlateRef.current) licensePlateRef.current.value = '';
                if (mileageRef.current) mileageRef.current.value = '';
                if (seatCountRef.current) seatCountRef.current.value = '';
                if (fuelCapacityRef.current) fuelCapacityRef.current.value = '';
                if (transmissionIdRef.current) transmissionIdRef.current.value = '';
                if (fuelTypeIdRef.current) fuelTypeIdRef.current.value = '';
                if (availableRef.current) availableRef.current.checked = false;

                toast.success('Véhicule ajouté avec succès !');
            } else {
                const errorData = await response.json();
                toast.error('Erreur lors de l\'ajout du véhicule : ' + errorData.message);
                console.error('Failed to add vehicle:', errorData.message);
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    // Suppression d'un véhicule individuellement
    const handleDeleteVehicle = async (vehicleId: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce véhicule ?")) return;
        try {
            const response = await fetch(`${process.env.backendAPI}/api/vehicles/${vehicleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const updatedVehicles = await getAllVehicles();
                if (updatedVehicles) {
                    setVehicles(updatedVehicles);
                }
                toast.success('Véhicule supprimé avec succès');
            } else {
                const deletedVehicle = await response.json();
                toast.error('Erreur lors de la suppression du véhicule : ' + deletedVehicle.message);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <Container fluid>
                <h1 className="mb-4">Gestion des véhicules:</h1>
                <p className="mb-5 text-secondary fs-5">Gérez les véhicules de votre flotte ici.</p>
                <div className="mb-4">
                    <Row className="w-100 justify-content-between align-items-center">
                        <Col xs={6} className="d-flex align-items-center flex-nowrap mb-3">
                            <h4 className="fs-2 fs-sm-3 fs-md-4 fs-lg-5 fs-xl-6">
                                Tous les véhicules
                            </h4>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-end align-items-center flex-nowrap mb-3">
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
                                            <th>ID VEH</th>
                                            <th>Marque</th>
                                            <th>Model</th>
                                            <th>Disponible</th>
                                            <th>Carburant</th>
                                            <th>Transmission</th>
                                            <th>Agence</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((vehicle, index) => (
                                            <tr
                                                key={index}
                                                onClick={(e) => {
                                                    if (
                                                        (e.target as HTMLElement).tagName !== 'INPUT' &&
                                                        (e.target as HTMLElement).tagName !== 'BUTTON' &&
                                                        (e.target as HTMLElement).tagName !== 'svg'
                                                    ) {
                                                        router.push(`/admin/vehicle/${vehicle.id_vehicle}/detail/`);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td><a href="#">{`SPK${vehicle.id_vehicle}`}</a></td>
                                                <td>{vehicle.brand}</td>
                                                <td>{vehicle.model}</td>
                                                <td>{vehicle.available ? 'Oui' : 'Non'}</td>
                                                <td>{vehicle.fuel_type?.fuel_name}</td>
                                                <td>{vehicle.transmission?.transmission_type}</td>
                                                <td>{vehicle.agency?.city}</td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleDeleteVehicle(vehicle.id_vehicle);
                                                        }}
                                                        title="Supprimer ce véhicule"
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
                                        placeholder="Entrez la marque"
                                        ref={brandRef}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Modèle</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Entrez le modèle"
                                        ref={modelRef}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Immatriculation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Entrez l'immatriculation"
                                        ref={licensePlateRef}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Kilométrage</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Entrez le kilométrage"
                                        ref={mileageRef}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Nombre de sièges</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Entrez le nombre de sièges"
                                        ref={seatCountRef}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Capacité du réservoir</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Entrez la capacité (litres)"
                                        ref={fuelCapacityRef}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Transmission</Form.Label>
                                    <Form.Select
                                        ref={transmissionIdRef}
                                        defaultValue=""
                                        aria-label="Sélectionnez une transmission"
                                    >
                                        <option value="">Sélectionnez une transmission</option>
                                        {transmissions.map((trans: any) => (
                                            <option key={trans.id_transmission} value={trans.id_transmission}>
                                                {trans.transmission_type}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Type de carburant</Form.Label>
                                    <Form.Select
                                        ref={fuelTypeIdRef}
                                        defaultValue=""
                                        aria-label="Sélectionnez un type de carburant"
                                    >
                                        <option value="">Sélectionnez un type</option>
                                        {fuelTypes.map((fuel: any) => (
                                            <option key={fuel.id_fuel} value={fuel.id_fuel}>
                                                {fuel.fuel_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Disponibilité</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        ref={availableRef}
                                        label="Disponible"
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

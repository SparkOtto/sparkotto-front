import React, { useRef, useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import {
    Card,
    Button,
    Row,
    Col,
    Form,
    Container,
    Modal,
    Spinner,
    Badge,
    Table,
    Stack,
    FormControl,
} from 'react-bootstrap';
import {
    FaPlus,
    FaTrash,
    FaCar,
    FaLeaf,
    FaCheckCircle,
    FaTimesCircle,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VehicleManagement() {
    // Refs for modal inputs
    const brandRef = useRef<HTMLInputElement>(null);
    const modelRef = useRef<HTMLInputElement>(null);
    const licensePlateRef = useRef<HTMLInputElement>(null);
    const mileageRef = useRef<HTMLInputElement>(null);
    const seatCountRef = useRef<HTMLInputElement>(null);
    const fuelCapacityRef = useRef<HTMLInputElement>(null);
    const transmissionIdRef = useRef<HTMLSelectElement>(null);
    const fuelTypeIdRef = useRef<HTMLSelectElement>(null);
    const agencyIdRef = useRef<HTMLSelectElement>(null);
    const availableRef = useRef<HTMLInputElement>(null);

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [fuelTypes, setFuelTypes] = useState<any[]>([]);
    const [transmissions, setTransmissions] = useState<any[]>([]);
    const [agencies, setAgencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const router = require('next/router').useRouter();

    // Fetch all data async
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [vehRes, fuelRes, transRes, agRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`, { credentials: 'include' }),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fueltype`, { credentials: 'include' }),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transmission`, { credentials: 'include' }),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agency`, { credentials: 'include' }),
            ]);

            const vehData = vehRes.ok ? await vehRes.json() : [];
            const fuelData = fuelRes.ok ? await fuelRes.json() : [];
            const transData = transRes.ok ? await transRes.json() : [];
            const agData = agRes.ok ? await agRes.json() : [];

            setVehicles(vehData);
            setFuelTypes(fuelData);
            setTransmissions(transData);
            setAgencies(agData);
        } catch {
            toast.error("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleAddVehicle = async () => {
        const newVehicle = {
            brand: brandRef.current?.value || '',
            model: modelRef.current?.value || '',
            license_plate: licensePlateRef.current?.value || '',
            mileage: mileageRef.current?.value ? Number(mileageRef.current.value) : null,
            seat_count: seatCountRef.current?.value ? Number(seatCountRef.current.value) : null,
            fuel_capacity: fuelCapacityRef.current?.value ? Number(fuelCapacityRef.current.value) : null,
            transmissionId: transmissionIdRef.current?.value ? Number(transmissionIdRef.current.value) : null,
            fuelTypeId: fuelTypeIdRef.current?.value ? Number(fuelTypeIdRef.current.value) : null,
            agency_id: agencyIdRef.current?.value ? Number(agencyIdRef.current.value) : null,
            available: availableRef.current?.checked || false,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVehicle),
            });

            if (response.ok) {
                const addedVehicle = await response.json();
                setVehicles(prev => [...prev, addedVehicle]);
                setShowModal(false);
                toast.success('Véhicule ajouté avec succès !');

                // Reset inputs
                brandRef.current!.value = '';
                modelRef.current!.value = '';
                licensePlateRef.current!.value = '';
                mileageRef.current!.value = '';
                seatCountRef.current!.value = '';
                fuelCapacityRef.current!.value = '';
                transmissionIdRef.current!.value = '';
                fuelTypeIdRef.current!.value = '';
                agencyIdRef.current!.value = '';
                availableRef.current!.checked = false;
            } else {
                const errorData = await response.json();
                toast.error('Erreur lors de l\'ajout : ' + errorData.message);
            }
        } catch {
            toast.error('Erreur serveur lors de l\'ajout.');
        }
    };

    const handleDeleteVehicle = async (vehicleId: number) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce véhicule ?')) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles/${vehicleId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                toast.success('Véhicule supprimé avec succès');
                fetchAllData();
            } else {
                const errorData = await response.json();
                toast.error('Erreur lors de la suppression : ' + errorData.message);
            }
        } catch {
            toast.error('Erreur serveur lors de la suppression');
        }
    };

    // Filter vehicles by search term
    const filteredVehicles = vehicles.filter(v => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return (
            (v.brand && v.brand.toLowerCase().includes(lower)) ||
            (v.model && v.model.toLowerCase().includes(lower)) ||
            (v.license_plate && v.license_plate.toLowerCase().includes(lower)) ||
            (v.agency?.city && v.agency.city.toLowerCase().includes(lower))
        );
    });

    // Count ecological vehicles
    const ecoCount = vehicles.filter(v => ['Electrique', 'Hybride'].includes(v.fuel_type?.fuel_name)).length;

    return (
        <Layout>
            <ToastContainer />
            <Container fluid className="py-4">
                <h2 className="fw-bold mb-3">Gestion des véhicules</h2>
                <p className="mb-4 text-muted">Gérez les véhicules de votre flotte facilement.</p>

                <Row className="mb-4 g-3">
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-muted small">Total véhicules</div>
                                    <div className="fs-3 fw-bold">{vehicles.length}</div>
                                </div>
                                <FaCar size={36} className="text-primary" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-success small">Disponibles</div>
                                    <div className="fs-3 fw-bold">{vehicles.filter(v => v.available).length}</div>
                                </div>
                                <FaLeaf size={36} className="text-success" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-info small">Écologiques</div>
                                    <div className="fs-3 fw-bold">{ecoCount}</div>
                                </div>
                                <FaLeaf size={36} className="text-info" />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="align-items-center mb-3">
                    <Col md={8} className="mb-2 mb-md-0">
                        <FormControl
                            placeholder="Rechercher par marque, modèle, immatriculation, agence..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            aria-label="Recherche véhicules"
                            size="lg"
                        />
                    </Col>
                    <Col md={4} className="text-md-end">
                        <Button variant="purple" onClick={() => setShowModal(true)}>
                            <FaPlus className="me-2" />
                            Ajouter un véhicule
                        </Button>
                    </Col>
                </Row>

                <Card className="shadow-sm">
                    <Card.Header className="fw-bold">Liste des véhicules</Card.Header>
                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" />
                            </div>
                        ) : filteredVehicles.length === 0 ? (
                            <div className="text-center py-5 text-muted">Aucun véhicule trouvé.</div>
                        ) : (
                            <Table responsive hover className="mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Marque</th>
                                        <th>Modèle</th>
                                        <th>Immatriculation</th>
                                        <th>Disponible</th>
                                        <th>Carburant</th>
                                        <th>Transmission</th>
                                        <th>Agence</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVehicles.map(vehicle => (
                                        <tr key={vehicle.id_vehicle}
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            // Éviter la redirection si clic sur bouton, SVG ou INPUT (ex: checkbox)
                                            const targetTag = (e.target as HTMLElement).tagName;
                                            if (targetTag !== 'BUTTON' && targetTag !== 'SVG' && targetTag !== 'INPUT') {
                                            router.push(`/admin/vehicle/${vehicle.id_vehicle}/detail/`);
                                            }
                                        }}>
                                            <td>{`SPK${vehicle.id_vehicle}`}</td>
                                            <td>{vehicle.brand}</td>
                                            <td>{vehicle.model}</td>
                                            <td>{vehicle.license_plate}</td>
                                            <td>
                                                {vehicle.available ? (
                                                    <Badge bg="success" className="d-inline-flex align-items-center">
                                                        <FaCheckCircle className="me-1" />
                                                        Oui
                                                    </Badge>
                                                ) : (
                                                    <Badge bg="danger" className="d-inline-flex align-items-center">
                                                        <FaTimesCircle className="me-1" />
                                                        Non
                                                    </Badge>
                                                )}
                                            </td>
                                            <td>{vehicle.fuel_type?.fuel_name || '-'}</td>
                                            <td>{vehicle.transmission?.transmission_type || '-'}</td>
                                            <td>{vehicle.agency?.city || '-'}</td>
                                            <td className="text-center">
                                                <Stack direction="horizontal" gap={2} className="justify-content-center">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteVehicle(vehicle.id_vehicle)}
                                                        title="Supprimer"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </Stack>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>


                {/* Add Vehicle Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton className="bg-purple text-white">
                        <Modal.Title>Ajouter un véhicule</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group controlId="brand">
                                        <Form.Label>Marque</Form.Label>
                                        <Form.Control type="text" placeholder="Marque" ref={brandRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="model">
                                        <Form.Label>Modèle</Form.Label>
                                        <Form.Control type="text" placeholder="Modèle" ref={modelRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="licensePlate">
                                        <Form.Label>Immatriculation</Form.Label>
                                        <Form.Control type="text" placeholder="Immatriculation" ref={licensePlateRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="mileage">
                                        <Form.Label>Kilométrage</Form.Label>
                                        <Form.Control type="number" placeholder="Kilométrage" ref={mileageRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="seatCount">
                                        <Form.Label>Nombre de sièges</Form.Label>
                                        <Form.Control type="number" placeholder="Nombre de sièges" ref={seatCountRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="fuelCapacity">
                                        <Form.Label>Capacité du réservoir (L)</Form.Label>
                                        <Form.Control type="number" placeholder="Capacité carburant" ref={fuelCapacityRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="transmissionId">
                                        <Form.Label>Transmission</Form.Label>
                                        <Form.Select ref={transmissionIdRef} defaultValue="">
                                            <option value="">Sélectionnez une transmission</option>
                                            {transmissions.map(t => (
                                                <option key={t.id_transmission} value={t.id_transmission}>
                                                    {t.transmission_type}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="fuelTypeId">
                                        <Form.Label>Type de carburant</Form.Label>
                                        <Form.Select ref={fuelTypeIdRef} defaultValue="">
                                            <option value="">Sélectionnez un type</option>
                                            {fuelTypes.map(f => (
                                                <option key={f.id_fuel} value={f.id_fuel}>
                                                    {f.fuel_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group controlId="agencyId">
                                        <Form.Label>Agence</Form.Label>
                                        <Form.Select ref={agencyIdRef} defaultValue="">
                                            <option value="">Sélectionnez une agence</option>
                                            {agencies.map(a => (
                                                <option key={a.id_agency} value={a.id_agency}>
                                                    {a.city}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="d-flex align-items-center my-2">
                                    <Form.Check type="checkbox" label="Disponible" ref={availableRef} />
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button variant="yellow" onClick={handleAddVehicle}>Ajouter</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Layout>
    );
}

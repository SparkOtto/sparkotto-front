import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Card, Button, Row, Col, Badge, Container, Stack } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FaLeaf, FaCar, FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Modal, Form } from "react-bootstrap";
import Cookies from 'js-cookie';
import { Vehicle, Trip, Key, Agency }  from '../../components/Interface';

const ECO_FUELS = ["Hybride", "Electrique"];

const fetchVehicles = async (): Promise<Vehicle[]> => {
    try {
        const response = await fetch(`${process.env.backendAPI}/api/vehicles`, {
            method: 'GET',
            credentials: 'include',
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

const fetchAgencies = async (): Promise<Agency[]> => {
    try {
        const response = await fetch(`${process.env.backendAPI}/api/agency`, {
            method: 'GET',
            credentials: 'include',
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

const VehicleReservationPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [reservationInfo, setReservationInfo] = useState({
        startDate: "",
        endDate: "",
        comment: "",
        etatInterieur: 0,
        etatExterieur: 0,
        departureAgency: null,
        arrivalAgency: null,
    });

    const [agencies, setAgencies] = useState<Agency[]>([]);

    useEffect(() => {
        // Fetch vehicles
        const loadVehicles = async () => {
            const fetchedVehicles = await fetchVehicles();
            if (fetchedVehicles) {
                setVehicles(fetchedVehicles);
            }
        };
        loadVehicles();

        // Fetch agencies
        const loadAgencies = async () => {
            const fetchedAgencies = await fetchAgencies();
            if (fetchedAgencies) {
                setAgencies(fetchedAgencies);
            }
        };
        loadAgencies();

    }, []);

    const getStatus = (vehicle: Vehicle) => {
        const now = new Date();
        const trips = vehicle.trips || [];
        const ongoingTrip = trips.find(
            (trip) =>
                new Date(trip.start_date) <= now &&
                new Date(trip.end_date) >= now &&
                trip.reservation_status === "confirmed"
        );
        if (!vehicle.available) {
            return "indisponible";
        }
        const pendingTrip = trips.find(
            (trip) =>
                trip.reservation_status === "pending"
        );
        if (pendingTrip) {
            return "pending";
        }
        if (ongoingTrip) {
            if (ongoingTrip.carpoolings && vehicle.seat_count - ongoingTrip.carpoolings.length > 0) {
                return "covoiturage";
            }
            return "indisponible";
        }
        return "disponible";
    };

    // Dashboard stats
    const total = vehicles.length;
    const available = vehicles.filter((v) => v.available && getStatus(v) === "disponible").length;
    const carpool = vehicles.filter((v) => v.available && getStatus(v) === "covoiturage").length;
    const unavailable = vehicles.filter((v) => v.available && getStatus(v) === "indisponible").length;

    const renderEcoBadge = (vehicle: Vehicle) =>
        ECO_FUELS.includes(vehicle.fuel_type.fuel_name) ? (
            <Badge bg="success" className="me-2">
                <FaLeaf />
            </Badge>
    ) : null;

    const renderStatus = (vehicle: Vehicle) => {
        const status = getStatus(vehicle);
        switch (status) {
            case "disponible":
                return <Badge bg="success"><FaCheckCircle className="me-1" />Disponible</Badge>;
            case "covoiturage":
                return <Badge bg="warning"><FaUsers className="me-1" />Covoiturage</Badge>;
            case "pending":
                return <Badge bg="warning"><FaUsers className="me-1" />En attente</Badge>;
            default:
                return <Badge bg="danger"><FaTimesCircle className="me-1" />Indisponible</Badge>;
        }
    };

    const handleReserve = (vehicle: Vehicle) => {
        if (getStatus(vehicle) === "indisponible") {
            toast.error("Ce véhicule est indisponible pour le moment.");
            return;
        }
        if (getStatus(vehicle) === "pending") {
            toast.error("Ce véhicule est en attente.");
            return;
        }
        if (getStatus(vehicle) === "covoiturage") {
            toast.info("Ce véhicule est en covoiturage.");
            return;
        }
        if (getStatus(vehicle) === "disponible") {
            setSelectedVehicle(vehicle);
            setShowModal(true);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedVehicle(null);
        setReservationInfo({
            startDate: "",
            endDate: "",
            comment: "",
            etatInterieur: 0,
            etatExterieur: 0,
            departureAgency: null,
            arrivalAgency: null,
        });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setReservationInfo({
            ...reservationInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendReservation(reservationInfo);
        } catch (error) {
            toast.error("Erreur lors de l'envoi de la réservation.");
        }
        handleModalClose();
    };

    const sendReservation = async (info: typeof reservationInfo) => {
        if (!selectedVehicle) return;

        const userCookie = Cookies.get('user');

        console.log(selectedVehicle.keys);

        const payload = {
            id_used_key: selectedVehicle.keys[0].id_key,
            id_vehicle: selectedVehicle.id_vehicle,
            id_driver: userCookie ? Number(JSON.parse(userCookie).id) : null,
            start_date: new Date(info.startDate),
            end_date: new Date(info.endDate),
            departure_agency: Number(info.departureAgency),
            arrival_agency: Number(info.arrivalAgency),
            reservation_status: "pending",
            carpooling: true,
        };

        console.log(payload);

        try {
            const response = await fetch(`${process.env.backendAPI}/api/trip`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 400) {
                    console.log(data);
                    toast.error(`Erreur de validation: ${data.message}`);
                } else if (response.status === 500) {
                    toast.error(`Erreur serveur: ${data.message}`);
                } else {
                    toast.error('Erreur inconnue lors de la réservation.');
                }
            } else {
                toast.success('Réservation envoyée avec succès !');
                // Optionally refresh vehicle list to reflect new reservation
                const fetchedVehicles = await fetchVehicles();
                if (fetchedVehicles) {
                    setVehicles(fetchedVehicles);
                }
            }
        } catch (error) {
            console.error('Error sending reservation:', error);
            toast.error('Erreur réseau lors de la réservation.');
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <Container fluid className="py-4">
                {/* Dashboard Header */}
                <div className="mb-4">
                    <h2 className="fw-bold mb-2">Demande de réservations</h2>
                </div>
                {/* Dashboard Stats */}
                <Row className="mb-4 g-3">
                    <Col xs={6} md={3}>
                        <Card className="text-center shadow-sm border-0">
                            <Card.Body>
                                <FaCar size={28} className="mb-2 text-primary" />
                                <h5 className="fw-bold">{total}</h5>
                                <div className="text-muted">Véhicules</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="text-center shadow-sm border-0">
                            <Card.Body>
                                <FaCheckCircle size={28} className="mb-2 text-success" />
                                <h5 className="fw-bold">{available}</h5>
                                <div className="text-muted">Disponibles</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="text-center shadow-sm border-0">
                            <Card.Body>
                                <FaUsers size={28} className="mb-2 text-warning" />
                                <h5 className="fw-bold">{carpool}</h5>
                                <div className="text-muted">Covoiturage possible</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="text-center shadow-sm border-0">
                            <Card.Body>
                                <FaTimesCircle size={28} className="mb-2 text-danger" />
                                <h5 className="fw-bold">{unavailable}</h5>
                                <div className="text-muted">Indisponibles</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* Vehicles Grid */}
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {vehicles.map((vehicle) => (
                        <Col key={vehicle.id_vehicle}>
                            <Card className="h-100 shadow-sm border-0">
                                {vehicle.image && (
                                    <Card.Img
                                        variant="top"
                                        src={vehicle.image}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        style={{ height: 160, objectFit: "cover", borderRadius: "0.5rem 0.5rem 0 0" }}
                                    />
                                )}
                                <Card.Body>
                                    <Stack direction="horizontal" gap={2} className="mb-2 justify-content-between">
                                        <div>{renderEcoBadge(vehicle)}</div>
                                        <div className="ms-auto">{renderStatus(vehicle)}</div>
                                    </Stack>
                                    <Card.Title className="fw-bold mb-1">
                                        {vehicle.brand} {vehicle.model}
                                    </Card.Title>
                                    <div className="mb-2 text-muted" style={{ fontSize: 14 }}>
                                        {vehicle.license_plate}
                                    </div>
                                    <div className="mb-1">
                                        <b>Carburant:</b> {vehicle.fuel_type.fuel_name}
                                    </div>
                                    <div className="mb-1">
                                        <b>Transmission:</b> {vehicle.transmission.transmission_type}
                                    </div>
                                    <div className="mb-1">
                                        <b>Places:</b> {vehicle.seat_count}
                                    </div>
                                    <div className="mb-1">
                                        <b>Kilométrage:</b> {vehicle.mileage} km
                                    </div>
                                </Card.Body>
                                <Card.Footer className="bg-white border-0">
                                    {getStatus(vehicle) !== "indisponible" && getStatus(vehicle) !== "pending" ? (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleReserve(vehicle)}
                                            disabled={getStatus(vehicle) === "indisponible"}
                                            className="w-100"
                                        >
                                            {getStatus(vehicle) === "covoiturage"
                                                ? "Rejoindre le covoiturage"
                                                : "Réserver"}
                                        </Button>
                                    ) : (
                                        <Button variant="secondary" disabled className="w-100">
                                            {getStatus(vehicle) === "pending"
                                                ? "En attente"
                                                : "Indisponible"}
                                        </Button>
                                    )}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            {/* Reservation Modal */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Réserver le véhicule</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFormSubmit}>
                    <Modal.Body>
                        <div className="mb-2">
                            <b>Véhicule:</b> {selectedVehicle?.brand} {selectedVehicle?.model}
                        </div>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="reservationDepartureAgency">
                                    <Form.Label>Agence de départ</Form.Label>
                                    <Form.Select
                                        name="departureAgency"
                                        value={reservationInfo.departureAgency || ""}
                                        onChange={(e) =>
                                            setReservationInfo({
                                                ...reservationInfo,
                                                departureAgency: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">Sélectionner une agence</option>
                                        {agencies.map((agency) => (
                                            <option key={agency.id_agency} value={agency.id_agency}>
                                                {agency.city} ({agency.street})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="reservationStartDate">
                                    <Form.Label>Date de début</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="startDate"
                                        value={reservationInfo.startDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="reservationArrivalAgency">
                                    <Form.Label>Agence d'arrivée</Form.Label>
                                    <Form.Select
                                        name="arrivalAgency"
                                        value={reservationInfo.arrivalAgency || ""}
                                        onChange={(e) =>
                                            setReservationInfo({
                                                ...reservationInfo,
                                                arrivalAgency: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">Sélectionner une agence</option>
                                        {agencies.map((agency) => (
                                            <option key={agency.id_agency} value={agency.id_agency}>
                                                {agency.city} ({agency.street})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="reservationEndDate">
                                    <Form.Label>Date de fin</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="endDate"
                                        value={reservationInfo.endDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3 justify-content-center">
                            <Col md={12} className="d-flex justify-content-center">
                                <Form.Group controlId="reservationEtatDesLieux" className="w-100">
                                    <Form.Label className="w-100 text-center my-3">État des lieux du véhicule</Form.Label>
                                    <div className="d-flex justify-content-around gap-5">
                                        {/* État intérieur */}
                                        <div className="text-center">
                                            <div className="mb-1 fw-semibold">Intérieur</div>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={`interieur-${star}`}
                                                    style={{
                                                        cursor: "pointer",
                                                        color:
                                                            (reservationInfo.etatInterieur || 0) >= star
                                                                ? "#ffc107"
                                                                : "#e4e5e9",
                                                        fontSize: 24,
                                                    }}
                                                    onClick={() =>
                                                        setReservationInfo({
                                                            ...reservationInfo,
                                                            etatInterieur: star,
                                                        })
                                                    }
                                                    data-testid={`star-interieur-${star}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        {/* État extérieur */}
                                        <div className="text-center">
                                            <div className="mb-1 fw-semibold">Extérieur</div>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={`exterieur-${star}`}
                                                    style={{
                                                        cursor: "pointer",
                                                        color:
                                                            (reservationInfo.etatExterieur || 0) >= star
                                                                ? "#ffc107"
                                                                : "#e4e5e9",
                                                        fontSize: 24,
                                                    }}
                                                    onClick={() =>
                                                        setReservationInfo({
                                                            ...reservationInfo,
                                                            etatExterieur: star,
                                                        })
                                                    }
                                                    data-testid={`star-exterieur-${star}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <Form.Group controlId="reservationComment" className="mt-4">
                                        <Form.Label>Commentaire (optionnel)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="comment"
                                            value={reservationInfo.comment}
                                            onChange={handleFormChange}
                                            placeholder="Ajouter un commentaire pour la réservation"
                                        />
                                    </Form.Group>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Annuler
                        </Button>
                        <Button variant="primary" type="submit">
                            Confirmer la réservation
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Layout>
    );
};

export default VehicleReservationPage;
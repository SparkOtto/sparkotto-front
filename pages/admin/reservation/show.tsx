import React, { useEffect, useState } from "react";
import Layout from '../../../components/Layout';
import {
    Card,
    Button,
    Row,
    Col,
    Badge,
    Container,
    Stack,
    Table,
    Modal,
    Spinner,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
    FaLeaf,
    FaCar,
    FaUsers,
    FaCheckCircle,
    FaTimesCircle,
    FaSyncAlt,
    FaEye,
    FaArrowRight,
} from "react-icons/fa";

import { Vehicle, Trip }  from '../../../components/Interface';
import { TRIP_STATUS_LABELS }  from '../../../components/ReservationStatus';


const ECO_FUELS = ["Hybride", "Electrique"];

const fetchVehicles = async (): Promise<Vehicle[]> => {
    try {
        const response = await fetch(`${process.env.backendAPI}/api/vehicles`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const data = await response.json();
            if (response.status === 500) {
                console.error("Server error:", data.message);
                return [];
            }
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return [];
    }
};

const fetchReservations = async (): Promise<Trip[]> => {
    try {
        const response = await fetch(`${process.env.backendAPI}/api/trip`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const data = await response.json();
            if (response.status === 500) {
                console.error("Server error:", data.message);
                return [];
            }
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return [];
    }
};

const VehicleAdminDashboard: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [reservations, setReservations] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Trip | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [veh, res] = await Promise.all([fetchVehicles(), fetchReservations()]);
        setVehicles(veh);
        setReservations(res);
        setLoading(false);
    };

    const getStatus = (vehicle: Vehicle) => {
        if (!vehicle.available) return "indisponible";
        if (vehicle.reservedSeats > 0 && vehicle.reservedSeats < vehicle.seat_count)
            return "covoiturage";
        if (vehicle.reservedSeats === 0) return "disponible";
        return "indisponible";
    };

    // Dashboard stats
    const total = vehicles.length;
    const available = vehicles.filter((v) => getStatus(v) === "disponible").length;
    const carpool = vehicles.filter((v) => getStatus(v) === "covoiturage").length;
    const unavailable = vehicles.filter((v) => getStatus(v) === "indisponible").length;

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
                return (
                    <Badge bg="primary">
                        <FaCheckCircle className="me-1" />
                        Disponible
                    </Badge>
                );
            case "covoiturage":
                return (
                    <Badge bg="warning" text="dark">
                        <FaUsers className="me-1" />
                        Covoiturage ({vehicle.seat_count - vehicle.reservedSeats} places)
                    </Badge>
                );
            default:
                return (
                    <Badge bg="danger">
                        <FaTimesCircle className="me-1" />
                        Indisponible
                    </Badge>
                );
        }
    };

    const handleViewReservation = (reservation: Trip) => {
        setSelectedReservation(reservation);
        setShowReservationModal(true);
    };

    const handleValidateReservation = (reservation: Trip) => {
        fetch(`${process.env.backendAPI}/api/trip/${reservation.id_trip}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reservation_status: "confirmed" }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.json();
                    toast.error(data.message || "Erreur lors de la validation.");
                } else {
                    toast.success("Réservation confirmed !");
                    loadData();
                }
            })
            .catch(() => {
                toast.error("Erreur lors de la validation.");
            });
    };

    const handleRefuseReservation = (reservation: Trip) => {
        fetch(`${process.env.backendAPI}/api/trip/${reservation.id_trip}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reservation_status: "cancelled" }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.json();
                    toast.error(data.message || "Erreur lors du refus.");
                } else {
                    toast.error("Réservation cancelled !");
                    loadData();
                }
            })
            .catch(() => {
                toast.error("Erreur lors du refus.");
            });
    };

    return (
        <Layout>
            <ToastContainer />
            <Container fluid className="py-4">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h2 className="fw-bold mb-0">Gestion des demandes de réservation</h2>
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
                {/* Reservations Table */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="fw-bold">Demandes de réservation</Card.Header>
                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <Table responsive hover className="mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Utilisateur</th>
                                        <th>Véhicule</th>
                                        <th>Période</th>
                                        <th>Itinéraire</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map((res, idx) => {
                                        const vehicle = vehicles.find((v) => v.id_vehicle === res.id_vehicle);
                                        return (
                                            <tr key={res.id_trip}>
                                                <td>{idx + 1}</td>
                                                <td>
                                                    <b>{res.driver.first_name} {res.driver.last_name}</b>
                                                    <br />
                                                    <span className="text-muted" style={{ fontSize: 12 }}>
                                                        {res.driver.email}
                                                    </span>
                                                </td>
                                                <td>
                                                    {vehicle ? (
                                                        <>
                                                            {vehicle.brand} {vehicle.model}
                                                            <br />
                                                            <span className="text-muted" style={{ fontSize: 12 }}>
                                                                {vehicle.license_plate}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-danger">Véhicule supprimé</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <Badge bg="light" text="dark" className="border">
                                                            <span className="fw-bold">
                                                                {new Date(res.start_date).toLocaleDateString("fr-FR", {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                        </Badge>
                                                        <span>
                                                            <FaArrowRight />
                                                        </span>
                                                        <Badge bg="light" text="dark" className="border">
                                                            <span className="fw-bold">
                                                                {new Date(res.end_date).toLocaleDateString("fr-FR", {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                        </Badge>
                                                    </Stack>
                                                </td>
                                                <td>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <Badge bg="primary" className="px-2">
                                                            {res.agency_departure.city}
                                                        </Badge>
                                                        <span>
                                                            <FaArrowRight />
                                                        </span>
                                                        <Badge bg="secondary" className="px-2">
                                                            {res.agency_arrival.city}
                                                        </Badge>
                                                    </Stack>
                                                </td>
                                                <td>
                                                    <Badge
                                                        bg={
                                                            res.reservation_status === "confirmed"
                                                                ? "success"
                                                                : res.reservation_status === "cancelled"
                                                                    ? "danger"
                                                                    : res.reservation_status === "completed"
                                                                        ? "secondary"
                                                                        : "warning"
                                                        }
                                                        text={res.reservation_status === "pending" ? "dark" : undefined}
                                                    >
                                                        {TRIP_STATUS_LABELS[res.reservation_status]}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-info"
                                                            onClick={() => handleViewReservation(res)}
                                                        >
                                                            <FaEye />
                                                        </Button>
                                                        {res.reservation_status === "pending" && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-success"
                                                                    onClick={() => handleValidateReservation(res)}
                                                                >
                                                                    <FaCheckCircle />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-danger"
                                                                    onClick={() => handleRefuseReservation(res)}
                                                                >
                                                                    <FaTimesCircle />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Stack>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>
            {/* Reservation Modal */}
            <Modal
                show={showReservationModal}
                onHide={() => {
                    setShowReservationModal(false);
                    setSelectedReservation(null);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Détail de la réservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <>
                            <p>
                                <b>Utilisateur :</b> {selectedReservation.driver.first_name} {selectedReservation.driver.last_name} (
                                {selectedReservation.driver.email})
                            </p>
                            <p>
                                <b>Période :</b>{" "}
                                {new Date(selectedReservation.start_date).toLocaleDateString()} -{" "}
                                {new Date(selectedReservation.end_date).toLocaleDateString()}
                            </p>
                            <p>
                                <b>Statut :</b>{" "}
                                <Badge
                                    bg={
                                        selectedReservation.reservation_status === "confirmed"
                                            ? "success"
                                            : selectedReservation.reservation_status === "cancelled"
                                                ? "danger"
                                                : selectedReservation.reservation_status === "completed"
                                                    ? "secondary"
                                                    : "warning"
                                    }
                                    text={selectedReservation.reservation_status === "pending" ? "dark" : undefined}
                                >
                                    {TRIP_STATUS_LABELS[selectedReservation.reservation_status]}
                                </Badge>
                            </p>
                            {selectedReservation.departure_agency && (
                                <p>
                                    <b>Agence de départ :</b> {selectedReservation.agency_departure.city}
                                </p>
                            )}
                            {selectedReservation.arrival_agency && (
                                <p>
                                    <b>Agence d'arrivée :</b> {selectedReservation.agency_arrival.city}
                                </p>
                            )}
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default VehicleAdminDashboard;
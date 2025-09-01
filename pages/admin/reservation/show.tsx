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
    Dropdown,
    Modal,
    Form,
    Spinner,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
    FaLeaf,
    FaCar,
    FaUsers,
    FaCheckCircle,
    FaTimesCircle,
    FaEdit,
    FaTrash,
    FaPlus,
    FaSyncAlt,
    FaEye,
} from "react-icons/fa";

type Vehicle = {
    id_vehicle: number;
    brand: string;
    model: string;
    fuel_type: { fuel_name: string };
    fuelTypeId: number;
    license_plate: string;
    mileage: number;
    seat_count: number;
    agency_id: number;
    available: boolean;
    fuel_capacity?: number;
    transmission: { transmission_type: string };
    transmissionId: number;
    reservedSeats: number;
    image?: string;
};

type Trip = {
    id_used_key: number;
    id_vehicle: number;
    id_driver: number;
    start_date: Date;
    end_date: Date;
    departure_agency: number;
    arrival_agency: number;
    reservation_status: string;
    carpooling: boolean;
    meeting_time?: Date;
    meeting_comment?: string;
};

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

const fetchReservations = async (): Promise<Reservation[]> => {
    try {
        const response = await fetch(`${process.env.backendAPI}/api/reservations`, {
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
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

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

    const handleViewReservation = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setShowReservationModal(true);
    };

    const handleValidateReservation = (reservation: Reservation) => {
        // TODO: Call API to validate
        toast.success(`Réservation validée pour ${reservation.user.name}`);
    };

    const handleRefuseReservation = (reservation: Reservation) => {
        // TODO: Call API to refuse
        toast.error(`Réservation refusée pour ${reservation.user.name}`);
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
                {/* Vehicles Table */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Liste des véhicules</span>
                        <Button variant="outline-secondary" size="sm" onClick={loadData}>
                            <FaSyncAlt />
                        </Button>
                    </Card.Header>
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
                                        <th></th>
                                        <th>Marque/Modèle</th>
                                        <th>Immatriculation</th>
                                        <th>Carburant</th>
                                        <th>Transmission</th>
                                        <th>Places</th>
                                        <th>Kilométrage</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((vehicle, idx) => (
                                        <tr key={vehicle.id_vehicle}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                {vehicle.image ? (
                                                    <img
                                                        src={vehicle.image}
                                                        alt=""
                                                        style={{
                                                            width: 60,
                                                            height: 40,
                                                            objectFit: "cover",
                                                            borderRadius: 4,
                                                        }}
                                                    />
                                                ) : (
                                                    <FaCar size={24} />
                                                )}
                                            </td>
                                            <td>
                                                {renderEcoBadge(vehicle)}
                                                <b>
                                                    {vehicle.brand} {vehicle.model}
                                                </b>
                                            </td>
                                            <td>{vehicle.license_plate}</td>
                                            <td>{vehicle.fuel_type.fuel_name}</td>
                                            <td>{vehicle.transmission.transmission_type}</td>
                                            <td>{vehicle.seat_count}</td>
                                            <td>{vehicle.mileage} km</td>
                                            <td>{renderStatus(vehicle)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
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
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map((res, idx) => {
                                        const vehicle = vehicles.find((v) => v.id_vehicle === res.vehicle_id);
                                        return (
                                            <tr key={res.id_reservation}>
                                                <td>{idx + 1}</td>
                                                <td>
                                                    <b>{res.user.name}</b>
                                                    <br />
                                                    <span className="text-muted" style={{ fontSize: 12 }}>
                                                        {res.user.email}
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
                                                    {new Date(res.start_date).toLocaleDateString()} -{" "}
                                                    {new Date(res.end_date).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <Badge
                                                        bg={
                                                            res.status === "validée"
                                                                ? "success"
                                                                : res.status === "refusée"
                                                                    ? "danger"
                                                                    : res.status === "terminée"
                                                                        ? "secondary"
                                                                        : "warning"
                                                        }
                                                        text={res.status === "en attente" ? "dark" : undefined}
                                                    >
                                                        {res.status}
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
                                                        {res.status === "en attente" && (
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
                                <b>Utilisateur :</b> {selectedReservation.user.name} (
                                {selectedReservation.user.email})
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
                                        selectedReservation.status === "validée"
                                            ? "success"
                                            : selectedReservation.status === "refusée"
                                                ? "danger"
                                                : selectedReservation.status === "terminée"
                                                    ? "secondary"
                                                    : "warning"
                                    }
                                    text={selectedReservation.status === "en attente" ? "dark" : undefined}
                                >
                                    {selectedReservation.status}
                                </Badge>
                            </p>
                            {/* ... autres infos ... */}
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default VehicleAdminDashboard;
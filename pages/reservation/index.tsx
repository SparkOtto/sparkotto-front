import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Card, Button, Row, Col, Badge, Container, Stack } from "react-bootstrap";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { FaLeaf, FaCar, FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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

const VehicleReservationPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        fetchVehicles().then(setVehicles);
    }, []);

    const getStatus = (vehicle: Vehicle) => {
        if (!vehicle.available) return "indisponible";
        if (vehicle.reservedSeats > 0 && vehicle.reservedSeats < vehicle.seat_count)
            return "covoiturage";
        if (vehicle.reservedSeats === 0) return "disponible";
        return "indisponible";
    };

    // Dashboard stats
    const total = vehicles.length;
    const available = vehicles.filter(v => getStatus(v) === "disponible").length;
    const carpool = vehicles.filter(v => getStatus(v) === "covoiturage").length;
    const unavailable = vehicles.filter(v => getStatus(v) === "indisponible").length;

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
                return <Badge bg="primary"><FaCheckCircle className="me-1" />Disponible</Badge>;
            case "covoiturage":
                return (
                    <Badge bg="warning" text="dark">
                        <FaUsers className="me-1" />
                        Covoiturage ({vehicle.seat_count - vehicle.reservedSeats} places)
                    </Badge>
                );
            default:
                return <Badge bg="danger"><FaTimesCircle className="me-1" />Indisponible</Badge>;
        }
    };

    const handleReserve = (vehicle: Vehicle) => {
        toast.success(`Réservation pour le véhicule ${vehicle.brand} ${vehicle.model}`);
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
                                    {getStatus(vehicle) !== "indisponible" ? (
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
                                            Indisponible
                                        </Button>
                                    )}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Layout>
    );
};

export default VehicleReservationPage;
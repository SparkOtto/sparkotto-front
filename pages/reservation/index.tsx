import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Card, Button, Row, Col, Badge, Container, Stack } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FaLeaf, FaCar, FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Modal, Form } from "react-bootstrap";
import Cookies from 'js-cookie';
import { Vehicle, Agency }  from '../../components/Interface';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale';


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

function getDatesBetween(start: Date, end: Date): Date[] {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
  }
  return dates;
}

const VehicleReservationPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [reservationInfo, setReservationInfo] = useState({
        startDate: null as Date | null,
        endDate: null as Date | null,
        comment: "",
        etatInterieur: 0,
        etatExterieur: 0,
        departureAgency: null,
        arrivalAgency: null,
    });

    const reservedDates: Date[] = [];
    if (selectedVehicle?.trips) {
        selectedVehicle.trips
            .filter(trip => trip.reservation_status === "pending" || trip.reservation_status === "confirmed")
            .forEach(trip => {
            const start = new Date(trip.start_date);
            const end = new Date(trip.end_date);
            reservedDates.push(...getDatesBetween(start, end));
        });
    }

    const carpoolTrips = vehicles.flatMap(vehicle =>
        (vehicle.trips || []).filter(
        trip => trip.carpooling && (trip.reservation_status === "confirmed")
        ).map(trip => ({ ...trip, vehicle }))
    );


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
        if (!vehicle.available) {
            return "unavailable";
        }
        return "available";
    };

    // Dashboard stats
    const available = vehicles.filter((v) => v.available && getStatus(v) === "available").length;
    const unavailable = vehicles.filter((v) => !v.available || getStatus(v) === "unavailable").length;

    const renderEcoBadge = (vehicle: Vehicle) =>
        ECO_FUELS.includes(vehicle.fuel_type.fuel_name) ? (
            <Badge bg="purple" className="me-2">
                <FaLeaf />
            </Badge>
    ) : null;

    const renderStatus = (vehicle: Vehicle) => {
        const status = getStatus(vehicle);
        switch (status) {
            case "available":
                return <Badge bg="purple"><FaCheckCircle className="me-1" />Disponible</Badge>;
            case "unavailable":
                return <Badge bg="secondary"><FaTimesCircle className="me-1" />Indisponible</Badge>;
            default:
                return <Badge bg="secondary"><FaTimesCircle className="me-1" />Indisponible</Badge>;
        }
    };

    const handleReserve = (vehicle: Vehicle) => {
        if (getStatus(vehicle) === "unavailable") {
            toast.error("Ce véhicule est indisponible pour le moment.");
            return;
        }
        if (getStatus(vehicle) === "available") {
            setSelectedVehicle(vehicle);
            setShowModal(true);
        }
    };

    const handleCarpooling = async (id_trip : number) => {
        const goCarpooling = await fetch(`${process.env.backendAPI}/api/carpooling`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_passenger: Number(JSON.parse(Cookies.get('user')).id), id_trip: id_trip }),
        });

        if (!goCarpooling.ok) {
            const data = await goCarpooling.json();
            toast.error(`Erreur : ${data.error}`);
        } else {
            toast.success('Vous avez rejoint le covoiturage avec succès !');
            const fetchedVehicles = await fetchVehicles();
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedVehicle(null);
        setReservationInfo({
            startDate: null,
            endDate: null,
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

        const payload = {
            id_used_key: selectedVehicle.keys[0].id_key,
            id_vehicle: selectedVehicle.id_vehicle,
            id_driver: userCookie ? Number(JSON.parse(userCookie).id) : null,
            start_date: reservationInfo.startDate ? reservationInfo.startDate.toISOString() : null,
            end_date: reservationInfo.endDate ? reservationInfo.endDate.toISOString() : null,
            departure_agency: Number(info.departureAgency),
            arrival_agency: Number(info.arrivalAgency),
            reservation_status: "pending",
            carpooling: true,
        };

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
                    toast.error(`Erreur de validation: ${data.message}`);
                } else if (response.status === 500) {
                    toast.error(`Erreur serveur: ${data.message}`);
                } else {
                    toast.error('Erreur inconnue lors de la réservation.');
                }
            } else {
                const vehicleCleanlinessState = await fetch(`${process.env.backendAPI}/api/vehicleState`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_vehicle: selectedVehicle.id_vehicle,
                        state_type: 'pending',
                        internal_cleanliness: reservationInfo.etatInterieur,
                        external_cleanliness: reservationInfo.etatExterieur,
                        comment: reservationInfo.comment,
                    }),
                });
                if (!vehicleCleanlinessState.ok) {
                    const data = await vehicleCleanlinessState.json();
                    toast.error(`Erreur lors de la mise à jour de l'état du véhicule: ${data.message}`);
                } else {
                    toast.success('Réservation envoyée avec succès !');
                    const fetchedVehicles = await fetchVehicles();
                    if (fetchedVehicles) {
                        setVehicles(fetchedVehicles);
                    }
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
                {/* Dashboard Stats - Modernized look */}
                <Row className="mb-4 g-3">
                    <Col xs={6} md={4}>
                        <Card className="text-center border-0 shadow-sm bg-light">
                            <Card.Body className="d-flex flex-column align-items-center py-4">
                                <div className="rounded-circle bg-purple bg-opacity-10 d-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                                    <FaCheckCircle size={24} className="text-purple" />
                                </div>
                                <div className="fw-bold fs-4">{available}</div>
                                <div className="text-muted small">Disponibles</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} md={4}>
                        <Card className="text-center border-0 shadow-sm bg-light">
                            <Card.Body className="d-flex flex-column align-items-center py-4">
                                <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                                    <FaUsers size={24} className="text-warning" />
                                </div>
                                <div className="fw-bold fs-4">{carpoolTrips.length}</div>
                                <div className="text-muted small">Covoiturage possible</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} md={4}>
                        <Card className="text-center border-0 shadow-sm bg-light">
                            <Card.Body className="d-flex flex-column align-items-center py-4">
                                <div className="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                                    <FaTimesCircle size={24} className="text-secondary" />
                                </div>
                                <div className="fw-bold fs-4">{unavailable}</div>
                                <div className="text-muted small">Indisponibles</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* Vehicles Grid */}
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {vehicles.map((vehicle) => (
                        <Col key={vehicle.id_vehicle}>
                            <Card className="h-100 shadow-sm border-0 bg-light">
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
                                    <Button
                                        variant={
                                            getStatus(vehicle) === "available"
                                                ? "purple text-white"
                                                : "secondary"
                                        }
                                        onClick={() => handleReserve(vehicle)}
                                        disabled={getStatus(vehicle) !== "available"}
                                        className="w-100 py-2"
                                    >
                                        {getStatus(vehicle) === "available"
                                            ? "Réserver"
                                            : "Indisponible"}
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Carpool Trips Section */}
                <div className="my-5">
                    <h3 className="fw-bold mb-3">Trajets disponibles au covoiturage</h3>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {carpoolTrips.length > 0 ? (
                            carpoolTrips.map(({ id_trip, start_date, end_date, departure_agency, arrival_agency, reservation_status, vehicle }) => (
                                <Col key={id_trip}>
                                    <Card className="h-100 shadow-sm border-0 bg-light">
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
                                                <div>
                                                    {renderEcoBadge(vehicle)}
                                                </div>
                                                <div className="ms-auto">
                                                    <Badge bg="warning">
                                                        <FaUsers className="me-1" />Covoiturage
                                                    </Badge>
                                                </div>
                                            </Stack>
                                            <Card.Title className="fw-bold mb-1">
                                                {vehicle.brand} {vehicle.model}
                                            </Card.Title>
                                            <div className="mb-2 text-muted" style={{ fontSize: 14 }}>
                                                {vehicle.license_plate}
                                            </div>
                                            <div className="mb-1">
                                                <b>Départ:</b> {new Date(start_date).toLocaleString('fr-FR')}
                                            </div>
                                            <div className="mb-1">
                                                <b>Retour:</b> {new Date(end_date).toLocaleString('fr-FR')}
                                            </div>
                                            <div className="mb-1">
                                                <b>Agence départ:</b> {agencies.find(a => a.id_agency === departure_agency)?.city || departure_agency}
                                            </div>
                                            <div className="mb-1">
                                                <b>Agence arrivée:</b> {agencies.find(a => a.id_agency === arrival_agency)?.city || arrival_agency}
                                            </div>
                                            {/* Affichage du nombre de places restantes */}
                                            <div className="mb-1">
                                                <b>Places restantes:</b>{" "}
                                                {vehicle.seat_count - 1 - (vehicle.trips?.find(t => t.id_trip === id_trip)?.carpoolings?.length)}
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="bg-white border-0">
                                            {(() => {
                                                const trip = vehicle.trips?.find(t => t.id_trip === id_trip);
                                                const maxSeats = vehicle.seat_count - 1; // 1 seat for driver
                                                const currentPassengers = trip?.carpoolings?.length || 0;
                                                const isFull = currentPassengers >= maxSeats;
                                                return (
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => !isFull && handleCarpooling(id_trip)}
                                                        className="w-100"
                                                        disabled={isFull}
                                                    >
                                                        {isFull ? "Covoiturage complet" : "Rejoindre le covoiturage"}
                                                    </Button>
                                                );
                                            })()}
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <Card className="text-center shadow-sm border-0">
                                    <Card.Body>
                                        <p className="mb-0">Aucun trajet disponible au covoiturage actuellement.</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </div>

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
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="reservationStartDate">
                                        <Form.Label>Date de début</Form.Label>
                                        <DatePicker
                                            selected={reservationInfo.startDate}
                                            onChange={(date: Date | null) => setReservationInfo({ ...reservationInfo, startDate: date })}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="Heure"
                                            dateFormat="Pp"
                                            selectsStart
                                            startDate={reservationInfo.startDate}
                                            endDate={reservationInfo.endDate}
                                            placeholderText="Choisir une date de début"
                                            className="form-control calendar-class"
                                            excludeDates={reservedDates}
                                            required
                                            locale={fr}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="reservationEndDate">
                                        <Form.Label>Date de fin</Form.Label>
                                        <DatePicker
                                            selected={reservationInfo.endDate}
                                            onChange={(date: Date | null) => setReservationInfo({ ...reservationInfo, endDate: date })}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="Heure"
                                            dateFormat="Pp"
                                            selectsEnd
                                            startDate={reservationInfo.startDate}
                                            endDate={reservationInfo.endDate}
                                            minDate={reservationInfo.startDate}
                                            placeholderText="Choisir une date de fin"
                                            className="form-control calendar-class"
                                            excludeDates={reservedDates}
                                            required
                                            locale={fr}
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
                            <Button variant="purple" className="text-white" type="submit">
                                Confirmer la réservation
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Layout>
    );
};

export default VehicleReservationPage;
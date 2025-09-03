
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { Trip } from '../../components/Interface';
import Cookies from 'js-cookie';

export default function Dashboard() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const userCookie = Cookies.get('user');
    const userId = userCookie ? Number(JSON.parse(userCookie).id) : null;
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    useEffect(() => {
        fetch(`${process.env.backendAPI}/api/trip/my/${userId}`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(res => res.json())
            .then(data => setTrips(data))
            .catch(() => setTrips([]))
            .finally(() => setLoading(false));
    }, []);

    const handleTripSelect = (trip: Trip) => {
        setSelectedTrip(trip);
    };

    return (
        <Layout>
            <>
                {/* Modal pour afficher la carte */}
                {selectedTrip && (
                    <>
                        <div
                            className="modal show d-block"
                            tabIndex={-1}
                            role="dialog"
                        >
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            Trajet : {selectedTrip.agency_departure.city} → {selectedTrip.agency_arrival.city}
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={() => setSelectedTrip(null)}
                                        />
                                    </div>
                                    <div className="modal-body">
                                        <div className="d-flex align-items-center justify-content-center bg-light border rounded w-100" style={{ minHeight: 300 }}>
                                            <span>Carte du trajet à afficher ici</span>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <Button variant="secondary" onClick={() => setSelectedTrip(null)}>
                                            Fermer
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop show"></div>
                    </>
                )}
                <div className="py-4 px-4 rounded bg-lightgray">
                    <h4 className="mb-4">Mes trajets à venir :</h4>
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
                        <Row className="g-4">
                            {trips.filter(trip =>
                                (trip.reservation_status === 'pending' || trip.reservation_status === 'confirmed') &&
                                new Date(trip.start_date) > new Date()
                            ).length === 0 ? (
                                <div>Aucun trajet à venir.</div>
                            ) : (
                                trips
                                    .filter(trip =>
                                        (trip.reservation_status === 'pending' || trip.reservation_status === 'confirmed') &&
                                        new Date(trip.start_date) > new Date()
                                    )
                                    .map((trip) => (
                                        <Col key={trip.id_trip} xs={12} md={4} lg={4}>
                                            <Card className="h-100 shadow-sm border-0">
                                                <Card.Body>
                                                    <div className="d-flex align-items-center mb-3">
                                                        {/* Calendar style date with Bootstrap only */}
                                                        <div className="d-flex flex-column align-items-center justify-content-center border rounded bg-white p-2 me-3" style={{ minWidth: 60 }}>
                                                            <span className="fs-2 fw-bold text-primary">
                                                                {new Date(trip.start_date).getDate()}
                                                            </span>
                                                            <span className="text-uppercase text-secondary small">
                                                                {new Date(trip.start_date).toLocaleString('fr-FR', { month: 'short' })}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Card.Title className="mb-1 fw-semibold">
                                                                {trip.agency_departure.city} <span className="text-primary">→</span> {trip.agency_arrival.city}
                                                            </Card.Title>
                                                        </div>
                                                    </div>
                                                    <Row className="mb-2">
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Départ</div>
                                                            <div className="fw-bold">{new Date(trip.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Arrivée</div>
                                                            <div className="fw-bold">{new Date(trip.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Véhicule</div>
                                                            <div className="fw-bold">{trip.vehicle?.brand || 'N/A'} {trip.vehicle?.model || 'N/A'}</div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Plaque</div>
                                                            <div className="fw-bold">{trip.vehicle?.license_plate || 'N/A'}</div>
                                                        </Col>
                                                    </Row>
                                                    <div className="mb-3">
                                                        <span className={`badge rounded-pill ${trip.vehicle && typeof trip.vehicle.seat_count === 'number' && (trip.vehicle.seat_count - 1 - trip.carpoolings.length) > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                            {trip.vehicle && typeof trip.vehicle.seat_count === 'number'
                                                                ? `${trip.vehicle.seat_count - 1 - trip.carpoolings.length} places libres`
                                                                : 'Complet'}
                                                        </span>
                                                    </div>
                                                    <Button variant="outline-primary" className="w-100" onClick={() => setSelectedTrip(trip)}>
                                                        Voir le trajet
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                            )}
                        </Row>
                    )}
                </div>
                {/* Section Mes trajets en cours */}
                <div className="py-4 px-4 rounded bg-light mt-5">
                    <h4 className="mb-4">Mes trajets en cours :</h4>
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
                        <Row className="g-4">
                            {trips.filter(trip =>
                                trip.reservation_status === 'confirmed' &&
                                new Date(trip.start_date) <= new Date() &&
                                new Date(trip.end_date) >= new Date()
                            ).length === 0 ? (
                                <div>Aucun trajet en cours.</div>
                            ) : (
                                trips
                                    .filter(trip =>
                                        trip.reservation_status === 'confirmed' &&
                                        new Date(trip.start_date) <= new Date() &&
                                        new Date(trip.end_date) >= new Date()
                                    )
                                    .map((trip) => (
                                        <Col key={trip.id_trip} xs={12} md={4} lg={4}>
                                            <Card className="h-100 shadow-sm border-0">
                                                <Card.Body>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="d-flex flex-column align-items-center justify-content-center border rounded bg-white p-2 me-3" style={{ minWidth: 60 }}>
                                                            <span className="fs-2 fw-bold text-warning">
                                                                {new Date(trip.start_date).getDate()}
                                                            </span>
                                                            <span className="text-uppercase text-secondary small">
                                                                {new Date(trip.start_date).toLocaleString('fr-FR', { month: 'short' })}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Card.Title className="mb-1 fw-semibold">
                                                                {trip.agency_departure.city} <span className="text-warning">→</span> {trip.agency_arrival.city}
                                                            </Card.Title>
                                                        </div>
                                                    </div>
                                                    <Row className="mb-2">
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Départ</div>
                                                            <div className="fw-bold">{new Date(trip.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Arrivée</div>
                                                            <div className="fw-bold">{new Date(trip.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Véhicule</div>
                                                            <div className="fw-bold">{trip.vehicle?.brand || 'N/A'} {trip.vehicle?.model || 'N/A'}</div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Plaque</div>
                                                            <div className="fw-bold">{trip.vehicle?.license_plate || 'N/A'}</div>
                                                        </Col>
                                                    </Row>
                                                    <div className="mb-3">
                                                        <span className="badge rounded-pill bg-warning text-dark">
                                                            Trajet en cours
                                                        </span>
                                                    </div>
                                                    <Button variant="outline-warning" className="w-100" onClick={() => setSelectedTrip(trip)}>
                                                        Voir le trajet
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                            )}
                        </Row>
                    )}
                </div>
                {/* Section Mes trajets passés */}
                <div className="py-4 px-4 rounded bg-light mt-5">
                    <h4 className="mb-4">Mes trajets passés :</h4>
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
                        <Row className="g-4">
                            {trips.filter(trip => 
                                trip.reservation_status === 'completed' ||
                                new Date(trip.end_date) < new Date()
                            ).length === 0 ? (
                                <div>Aucun trajet passé.</div>
                            ) : (
                                trips
                                    .filter(trip => 
                                        trip.reservation_status === 'completed' ||
                                        new Date(trip.end_date) < new Date()
                                    )
                                    .map((trip) => (
                                        <Col key={trip.id_trip} xs={12} md={4} lg={4}>
                                            <Card className="h-100 shadow-sm border-0">
                                                <Card.Body>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="d-flex flex-column align-items-center justify-content-center border rounded bg-white p-2 me-3" style={{ minWidth: 60 }}>
                                                            <span className="fs-2 fw-bold text-secondary">
                                                                {new Date(trip.start_date).getDate()}
                                                            </span>
                                                            <span className="text-uppercase text-secondary small">
                                                                {new Date(trip.start_date).toLocaleString('fr-FR', { month: 'short' })}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Card.Title className="mb-1 fw-semibold">
                                                                {trip.agency_departure.city} <span className="text-secondary">→</span> {trip.agency_arrival.city}
                                                            </Card.Title>
                                                        </div>
                                                    </div>
                                                    <Row className="mb-2">
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Départ</div>
                                                            <div className="fw-bold">{new Date(trip.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Arrivée</div>
                                                            <div className="fw-bold">{new Date(trip.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Véhicule</div>
                                                            <div className="fw-bold">{trip.vehicle?.brand || 'N/A'} {trip.vehicle?.model || 'N/A'}</div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <div className="small text-muted">Plaque</div>
                                                            <div className="fw-bold">{trip.vehicle?.license_plate || 'N/A'}</div>
                                                        </Col>
                                                    </Row>
                                                    <div className="mb-3">
                                                        <span className="badge rounded-pill bg-secondary">
                                                            Trajet terminé
                                                        </span>
                                                    </div>
                                                    <Button variant="outline-secondary" className="w-100" disabled>
                                                        Voir le trajet
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                            )}
                        </Row>
                    )}
                </div>
            </>
        </Layout>
    );
}

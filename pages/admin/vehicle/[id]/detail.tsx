import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout';
import { Button, Container, Row, Col, Spinner, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function VehicleDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    const getVehicleById = async (vehicleId) => {
        const simulatedData = [
            { id: 1, make: 'Tesla', model: 'Model S', year: 2022, registration: 'TES123', available: true, mileage: 7800, costPerKm: 7800 },
            { id: 2, make: 'BMW', model: 'X5', year: 2021, registration: 'BMW456', available: false, mileage: 12000, costPerKm: 12000 },
            { id: 3, make: 'Audi', model: 'A4', year: 2020, registration: 'AUD789', available: true, mileage: 9000, costPerKm: 9000 },
            { id: 4, make: 'Mercedes', model: 'C-Class', year: 2019, registration: 'MER321', available: false, mileage: 15000, costPerKm: 15000 },
            { id: 5, make: 'Volkswagen', model: 'Golf', year: 2023, registration: 'VW654', available: true, mileage: 5000, costPerKm: 5000 },
        ];
        return simulatedData.find(v => v.id === Number(vehicleId)) || null;
    };

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getVehicleById(id).then(vehicleData => {
            setVehicle(vehicleData);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <Container fluid className="text-center vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
                    <Spinner animation="border" role="status" />
                    <p className="mt-3">Chargement...</p>
                </Container>
            </Layout>
        );
    }

    if (!vehicle) {
        return (
            <Layout>
                <Container fluid className="text-center vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
                    <h1 className="mb-4">Détails du véhicule</h1>
                    <p className="text-danger">Véhicule introuvable.</p>
                    <Button variant="primary" className="mt-3" onClick={() => router.push('/admin/vehicle/show')}>
                        Retour à la liste
                    </Button>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container fluid className="vh-100 bg-light d-flex flex-column align-items-center">
                <div className="w-100" style={{ maxWidth: 600, marginTop: 60 }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Button variant="dark" className="px-4 py-2 fw-bold" onClick={() => router.push('/admin/vehicle/show')}>
                            &lt; Retour
                        </Button>
                    </div>
                    <div className="bg-dark rounded p-4 shadow mb-4">
                        <Form>
                            <Row className="mb-4">
                                <Col>
                                    <Form.Group>
                                        <Form.Label className="text-white fw-bold">Vehicle-ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={vehicle.registration}
                                            readOnly
                                            className="bg-secondary text-white border-0 rounded"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className="text-white fw-bold">Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="MM/DD/YY"
                                            className="bg-secondary text-white border-0 rounded"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col>
                                    <Form.Group>
                                        <Form.Label className="text-white fw-bold">Kilométrage actuel</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={vehicle.mileage?.toLocaleString() || ''}
                                            readOnly
                                            className="bg-secondary text-white border-0 rounded"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className="text-white fw-bold">Coût au kilométrage</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={vehicle.costPerKm?.toLocaleString() || ''}
                                            readOnly
                                            className="bg-secondary text-white border-0 rounded"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-center mt-4">
                                <Button variant="dark" className="w-50 rounded fw-bold shadow">
                                    Ajouter
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

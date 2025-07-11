import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout';
import { Button, Container, Row, Col, Spinner, Card, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';

export default function VehicleDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    const getVehicleById = async (vehicleId) => {
        const response = await fetch(`/api/vehicles/${vehicleId}`);
        console.log(response);
        if (!response.ok) {
            throw new Error('Failed to fetch vehicle data');
        }
        return await response.json();
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
            <Container className="py-5">
                <Row className="mb-4">
                    <Col>
                        <Button variant="dark" onClick={() => router.push('/admin/vehicle/show')} className="d-flex align-items-center gap-2">
                            <FaArrowLeft />
                            Retour
                        </Button>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <h2 className='mb-5 text-center'>Détails du véhicule : {vehicle.make} {vehicle.model}</h2>
                    <Col md={8}>
                        <Card className="shadow-lg">
                            <Card.Body className="p-4 bg-dark">
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Card className="p-3 bg-dark text-white border-1 border-light">
                                            <h6 className="text-light">Marque</h6>
                                            <p className="fs-5">{vehicle.make}</p>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="p-3 bg-dark text-white border-1 border-light">
                                            <h6 className="text-light">Modèle</h6>
                                            <p className="fs-5">{vehicle.model}</p>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Card className="p-3 bg-dark text-white border-1 border-light">
                                            <h6 className="text-light">Année</h6>
                                            <p className="fs-5">{vehicle.year}</p>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="p-3 bg-dark text-white border-1 border-light">
                                            <h6 className="text-light">Immatriculation</h6>
                                            <p className="fs-5">{vehicle.registration}</p>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Card className="p-3 bg-dark text-white border-1 border-light">
                                            <h6 className="text-light">Kilométrage</h6>
                                            <p className="fs-5">{vehicle.mileage?.toLocaleString()} km</p>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="p-3 bg-dark text-white border-1 border-light">
                                            <h6 className="text-light">Coût par km</h6>
                                            <p className="fs-5">{vehicle.costPerKm?.toLocaleString()} €</p>
                                        </Card>
                                    </Col>
                                </Row>
                                <div className="text-center mt-4">
                                    <Button variant="warning" className="px-5">
                                        Modifier
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

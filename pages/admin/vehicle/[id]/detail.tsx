import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../../../components/Layout';
import { Button, Container, Row, Col, Spinner, Card, Form, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';
import { Vehicle }  from '../../../../components/Interface';

export default function VehicleDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Refs pour chaque champ
    const brandRef = useRef<HTMLInputElement>(null);
    const modelRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);
    const mileageRef = useRef<HTMLInputElement>(null);
    const seatCountRef = useRef<HTMLInputElement>(null);
    const fuelCapacityRef = useRef<HTMLInputElement>(null);
    const transmissionIdRef = useRef<HTMLSelectElement>(null);
    const fuelTypeIdRef = useRef<HTMLSelectElement>(null);
    const agencyIdRef = useRef<HTMLSelectElement>(null);
    const availableRef = useRef<HTMLInputElement>(null);

    const [fuelTypes, setFuelTypes] = useState<any[]>([]);
    const [transmissions, setTransmissions] = useState<any[]>([]);
    const [agencies, setAgencies] = useState<any[]>([]);

    // Fetch lists
    useEffect(() => {
        const fetchFuelTypes = async () => {
            const res = await fetch(`${process.env.backendAPI}/api/fueltype`, { credentials: 'include' });
            if (res.ok) setFuelTypes(await res.json());
        };
        const fetchTransmissions = async () => {
            const res = await fetch(`${process.env.backendAPI}/api/transmission`, { credentials: 'include' });
            if (res.ok) setTransmissions(await res.json());
        };
        const fetchAgencies = async () => {
            const res = await fetch(`${process.env.backendAPI}/api/agency`, { credentials: 'include' });
            if (res.ok) setAgencies(await res.json());
        };
        fetchFuelTypes();
        fetchTransmissions();
        fetchAgencies();
    }, []);

    const getVehicleById = async (vehicleId: string | string[] | undefined) => {
        const response = await fetch(`${process.env.backendAPI}/api/vehicles/${vehicleId}`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch vehicle data');
        }
        return await response.json();
    };

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getVehicleById(id)
            .then((vehicleData) => {
                setVehicle(vehicleData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle) return;
        setSaving(true);
        setError(null);
        setSuccess(false);

        const { id_vehicle, ...rest } = vehicle as any;
        const preparedForm = {
            ...rest,
            brand: brandRef.current?.value || '',
            model: modelRef.current?.value || '',
            license_plate: licenseRef.current?.value || '',
            mileage: Number(mileageRef.current?.value) || 0,
            seat_count: seatCountRef.current?.value ? Number(seatCountRef.current.value) : null,
            fuel_capacity: fuelCapacityRef.current?.value ? Number(fuelCapacityRef.current.value) : null,
            transmissionId: transmissionIdRef.current?.value ? Number(transmissionIdRef.current.value) : null,
            fuelTypeId: fuelTypeIdRef.current?.value ? Number(fuelTypeIdRef.current.value) : null,
            agency_id: agencyIdRef.current?.value ? Number(agencyIdRef.current.value) : null,
            available: availableRef.current?.checked || false,
        };

        try {
            const response = await fetch(`${process.env.backendAPI}/api/vehicles/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preparedForm),
            });
            if (response.ok) {
                const updated = await response.json();
                setVehicle(updated);
                setEditMode(false);
                setSuccess(true);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Erreur inconnue');
            }
        } catch (err: any) {
            console.log(err.message);
            setError(err.message || 'Erreur inconnue');
        } finally {
            setSaving(false);
        }
    };

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
                    <h2 className="mb-5 text-center">Détails du véhicule : {vehicle.brand} {vehicle.model}</h2>
                    <Col md={8}>
                        <Card className="shadow-lg">
                            <Card.Body className="p-4 bg-dark">
                                {success && <Alert variant="success">Modifications enregistrées !</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}
                                {!editMode ? (
                                    <>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Marque</h6>
                                                    <p className="fs-5">{vehicle.brand}</p>
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
                                                    <h6 className="text-light">Immatriculation</h6>
                                                    <p className="fs-5">{vehicle.license_plate}</p>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Kilométrage</h6>
                                                    <p className="fs-5">{vehicle.mileage?.toLocaleString()} km</p>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Nombre de sièges</h6>
                                                    <p className="fs-5">{vehicle.seat_count ?? '-'}</p>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Capacité du réservoir</h6>
                                                    <p className="fs-5">{vehicle.fuel_capacity ?? '-'} L</p>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Transmission</h6>
                                                    <p className="fs-5">{vehicle.transmission?.transmission_type ?? '-'}</p>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Type de carburant</h6>
                                                    <p className="fs-5">{vehicle.fuel_type?.fuel_name ?? '-'}</p>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Agence</h6>
                                                    <p className="fs-5">{vehicle.agency?.city ?? '-'}</p>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Disponible</h6>
                                                    <p className="fs-5">{vehicle.available ? 'Oui' : 'Non'}</p>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <div className="text-center mt-4">
                                            <Button variant="warning" className="px-5" onClick={() => setEditMode(true)}>
                                                Modifier
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <Form onSubmit={handleSave}>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Marque</Form.Label>
                                                    <Form.Control type="text" defaultValue={vehicle.brand} ref={brandRef} required />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Modèle</Form.Label>
                                                    <Form.Control type="text" defaultValue={vehicle.model} ref={modelRef} required />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Immatriculation</Form.Label>
                                                    <Form.Control type="text" defaultValue={vehicle.license_plate} ref={licenseRef} required />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Kilométrage</Form.Label>
                                                    <Form.Control type="number" defaultValue={vehicle.mileage} ref={mileageRef} required min={0} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Nombre de sièges</Form.Label>
                                                    <Form.Control type="number" defaultValue={vehicle.seat_count ?? ''} ref={seatCountRef} min={1} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Capacité du réservoir (L)</Form.Label>
                                                    <Form.Control type="number" defaultValue={vehicle.fuel_capacity ?? ''} ref={fuelCapacityRef} min={0} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Transmission</Form.Label>
                                                    <Form.Select
                                                        ref={transmissionIdRef}
                                                        defaultValue={vehicle.transmissionId ?? vehicle.transmission?.id_transmission ?? ''}
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
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Type de carburant</Form.Label>
                                                    <Form.Select
                                                        ref={fuelTypeIdRef}
                                                        defaultValue={vehicle.fuelTypeId ?? vehicle.fuel_type?.id_fuel ?? ''}
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
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Agence</Form.Label>
                                                    <Form.Select
                                                        ref={agencyIdRef}
                                                        defaultValue={vehicle.agency_id ?? vehicle.agency?.id_agency ?? ''}
                                                        aria-label="Sélectionnez une agence"
                                                    >
                                                        <option value="">Sélectionnez une agence</option>
                                                        {agencies.map((agency: any) => (
                                                            <option key={agency.id_agency} value={agency.id_agency}>
                                                                {agency.city}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Disponibilité</Form.Label>
                                                    <Form.Check
                                                        type="checkbox"
                                                        ref={availableRef}
                                                        label="Disponible"
                                                        defaultChecked={vehicle.available}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="text-center mt-4 d-flex justify-content-center gap-3">
                                            <Button variant="secondary" onClick={() => setEditMode(false)} disabled={saving}>
                                                Annuler
                                            </Button>
                                            <Button variant="warning" type="submit" className="px-5" disabled={saving}>
                                                {saving ? <Spinner size="sm" animation="border" /> : 'Enregistrer'}
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

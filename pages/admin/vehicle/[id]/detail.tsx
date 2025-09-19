import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../../../components/Layout';
import { Button, Container, Row, Col, Spinner, Card, Form, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Vehicle } from '../../../../components/Interface';

export default function VehicleDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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

    useEffect(() => {
        const fetchLists = async () => {
            const [fuelRes, transRes, agencyRes] = await Promise.all([
                fetch(`${process.env.backendAPI}/api/fueltype`, { credentials: 'include' }),
                fetch(`${process.env.backendAPI}/api/transmission`, { credentials: 'include' }),
                fetch(`${process.env.backendAPI}/api/agency`, { credentials: 'include' }),
            ]);
            if (fuelRes.ok) setFuelTypes(await fuelRes.json());
            if (transRes.ok) setTransmissions(await transRes.json());
            if (agencyRes.ok) setAgencies(await agencyRes.json());
        };
        fetchLists();
    }, []);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`${process.env.backendAPI}/api/vehicles/${id}`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('Véhicule introuvable');
                return res.json();
            })
            .then(data => setVehicle(data))
            .catch(() => setVehicle(null))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle) return;
        setSaving(true);
        setError(null);
        setSuccess(false);

        const formData = {
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
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const updated = await response.json();
                setVehicle(updated);
                setEditMode(false);
                setSuccess(true);
            } else {
                const errData = await response.json();
                setError(errData.message || 'Erreur inconnue');
            }
        } catch (err: any) {
            setError(err.message || 'Erreur inconnue');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light text-center">
                    <Spinner animation="border" role="status" />
                    <p className="mt-3">Chargement...</p>
                </Container>
            </Layout>
        );
    }

    if (!vehicle) {
        return (
            <Layout>
                <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light text-center">
                    <h1>Détails du véhicule</h1>
                    <p className="text-danger">Véhicule introuvable.</p>
                    <Button variant="primary" onClick={() => router.push('/admin/vehicle/show')}>Retour à la liste</Button>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container className="py-5">
                <Row className="mb-3">
                    <Col>
                        <Button variant="dark" onClick={() => router.push('/admin/vehicle/show')} className="d-flex align-items-center gap-2">
                            <FaArrowLeft /> Retour
                        </Button>
                    </Col>
                </Row>
                <h2 className="text-center mb-5">
                    Détails du véhicule : {vehicle.brand} {vehicle.model}
                </h2>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-lg bg-dark border-light">
                            <Card.Body className="p-4 text-white">
                                {success && <Alert variant="success">Modifications enregistrées !</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}
                                {!editMode ? (
                                    <>
                                        <Row className="mb-3">
                                            {[
                                                { label: "Marque", value: vehicle.brand },
                                                { label: "Modèle", value: vehicle.model },
                                                { label: "Immatriculation", value: vehicle.license_plate },
                                                { label: "Kilométrage", value: vehicle.mileage?.toLocaleString() + ' km' || '-' },
                                                { label: "Nombre de sièges", value: vehicle.seat_count ?? '-' },
                                                { label: "Capacité du réservoir", value: vehicle.fuel_capacity ? vehicle.fuel_capacity + ' L' : '-' },
                                                { label: "Transmission", value: vehicle.transmission?.transmission_type ?? '-' },
                                                { label: "Type de carburant", value: vehicle.fuel_type?.fuel_name ?? '-' },
                                                { label: "Agence", value: vehicle.agency?.city ?? '-' },
                                                { label: "Disponible", value: vehicle.available ? <><FaCheckCircle className="text-success me-1" />Oui</> : <><FaTimesCircle className="text-danger me-1" />Non</> },
                                            ].map(({ label, value }, i) => (
                                                <Col md={6} key={i} className="mb-3">
                                                    <Card className="p-3 bg-dark border border-light">
                                                        <h6 className="text-white">{label}</h6>
                                                        <p className="fs-5 m-0 text-white">{value}</p>
                                                    </Card>
                                                </Col>
                                            ))}
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
                                                    <Form.Label>Marque</Form.Label>
                                                    <Form.Control type="text" defaultValue={vehicle.brand} ref={brandRef} required />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Modèle</Form.Label>
                                                    <Form.Control type="text" defaultValue={vehicle.model} ref={modelRef} required />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Immatriculation</Form.Label>
                                                    <Form.Control type="text" defaultValue={vehicle.license_plate} ref={licenseRef} required />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Kilométrage</Form.Label>
                                                    <Form.Control type="number" defaultValue={vehicle.mileage ?? 0} ref={mileageRef} min={0} required />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Nombre de sièges</Form.Label>
                                                    <Form.Control type="number" defaultValue={vehicle.seat_count ?? ''} ref={seatCountRef} min={1} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Capacité du réservoir (L)</Form.Label>
                                                    <Form.Control type="number" defaultValue={vehicle.fuel_capacity ?? ''} ref={fuelCapacityRef} min={0} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Transmission</Form.Label>
                                                    <Form.Select ref={transmissionIdRef} defaultValue={vehicle.transmissionId ?? vehicle.transmission?.id_transmission ?? ''}>
                                                        <option value="">Sélectionnez une transmission</option>
                                                        {transmissions.map((t: any) => (
                                                            <option key={t.id_transmission} value={t.id_transmission}>{t.transmission_type}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Type de carburant</Form.Label>
                                                    <Form.Select ref={fuelTypeIdRef} defaultValue={vehicle.fuelTypeId ?? vehicle.fuel_type?.id_fuel ?? ''}>
                                                        <option value="">Sélectionnez un type</option>
                                                        {fuelTypes.map((f: any) => (
                                                            <option key={f.id_fuel} value={f.id_fuel}>{f.fuel_name}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Agence</Form.Label>
                                                    <Form.Select ref={agencyIdRef} defaultValue={vehicle.agency_id ?? vehicle.agency?.id_agency ?? ''}>
                                                        <option value="">Sélectionnez une agence</option>
                                                        {agencies.map((a: any) => (
                                                            <option key={a.id_agency} value={a.id_agency}>{a.city}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Check 
                                                    type="checkbox" 
                                                    label="Disponible" 
                                                    ref={availableRef} 
                                                    defaultChecked={vehicle.available} 
                                                />
                                            </Col>
                                        </Row>
                                        <div className="d-flex justify-content-center gap-3 mt-4">
                                            <Button variant="secondary" onClick={() => setEditMode(false)} disabled={saving}>Annuler</Button>
                                            <Button variant="warning" type="submit" disabled={saving}>
                                                {saving ? <Spinner animation="border" size="sm" /> : 'Enregistrer'}
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

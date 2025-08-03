import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout';
import { Button, Container, Row, Col, Spinner, Card, Form, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';

type Agency = {
    id_agency: string;
    city: string;
    postal_code: string;
    street: string;
    additional_info?: string;
    phone: string;
    head_office: string;
};

export default function AgencyDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [agency, setAgency] = useState<Agency | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<Agency | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const getAgencyById = async (agencyId: string | string[] | undefined) => {
        const response = await fetch(`${process.env.backendAPI}/api/agency/${agencyId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch agency data');
        }
        return await response.json();
    };

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getAgencyById(id).then(agencyData => {
            setAgency(agencyData);
            setForm(agencyData);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!form) return;
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        // Préparer les données du formulaire : convertir head_office en booléen
        const preparedForm = form
            ? {
                ...form,
                head_office:
                    form.head_office === 'oui' ||
                    form.head_office === 'true' ||
                    form.head_office === '1' ||
                    form.head_office === true
                        ? true
                        : false,
            }
            : null;

        try {
            const response = await fetch(`${process.env.backendAPI}/api/agency/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preparedForm),
            });
            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
            const updated = await response.json();
            setAgency(updated);
            setForm(updated);
            setEditMode(false);
            setSuccess(true);
        } catch (err: any) {
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

    if (!agency) {
        return (
            <Layout>
                <Container fluid className="text-center vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
                    <h1 className="mb-4">Détails de l'agence</h1>
                    <p className="text-danger">Agence introuvable.</p>
                    <Button variant="primary" className="mt-3" onClick={() => router.push('/admin/agency/show')}>
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
                        <Button variant="dark" onClick={() => router.push('/admin/agency/show')} className="d-flex align-items-center gap-2">
                            <FaArrowLeft />
                            Retour
                        </Button>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <h2 className='mb-5 text-center'>Détails de l'agence de : {agency.city}</h2>
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
                                                    <h6 className="text-light">Ville</h6>
                                                    <p className="fs-5">{agency.city}</p>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Code Postal</h6>
                                                    <p className="fs-5">{agency.postal_code}</p>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Rue</h6>
                                                    <p className="fs-5">{agency.street}</p>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Complément d'adresse</h6>
                                                    <p className="fs-5">{agency.additional_info || '-'}</p>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Téléphone</h6>
                                                    <p className="fs-5">{agency.phone}</p>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="p-3 bg-dark text-white border-1 border-light">
                                                    <h6 className="text-light">Siège social</h6>
                                                    <p className="fs-5">
                                                        {(agency.head_office === true ||
                                                          agency.head_office === 'oui' ||
                                                          agency.head_office === 'true' ||
                                                          agency.head_office === '1' ||
                                                          agency.head_office === 1)
                                                            ? 'Oui'
                                                            : 'Non'}
                                                    </p>
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
                                                    <Form.Label className="text-light">Ville</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city"
                                                        value={form?.city || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Code Postal</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="postal_code"
                                                        value={form?.postal_code || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Rue</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="street"
                                                        value={form?.street || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Complément d'adresse</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="additional_info"
                                                        value={form?.additional_info || ''}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Téléphone</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="phone"
                                                        value={form?.phone || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="text-light">Siège social</Form.Label>
                                                    <Form.Check
                                                        type="checkbox"
                                                        label={<span className="fw-bold text-white">Siège social</span>}
                                                        name="head_office"
                                                        id="head_office_checkbox"
                                                        checked={
                                                            form?.head_office === true ||
                                                            form?.head_office === 'oui' ||
                                                            form?.head_office === 'true' ||
                                                            form?.head_office === '1' ||
                                                            form?.head_office === 1
                                                        }
                                                        onChange={e =>
                                                            setForm(form =>
                                                                form
                                                                    ? { ...form, head_office: e.target.checked }
                                                                    : form
                                                            )
                                                        }
                                                        className="custom-checkbox"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="text-center mt-4 d-flex justify-content-center gap-3">
                                            <Button variant="secondary" onClick={() => { setEditMode(false); setForm(agency); }} disabled={saving}>
                                                Annuler
                                            </Button>
                                            <Button variant="yellow" type="submit" className="px-5" disabled={saving}>
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

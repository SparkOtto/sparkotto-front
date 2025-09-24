import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../../../components/Layout';
import { Button, Container, Row, Col, Spinner, Card, Form, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Agency } from '../../../../components/Interface';

export default function AgencyDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // refs pour chaque champ
  const cityRef = useRef<HTMLInputElement>(null);
  const postalRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const addInfoRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const headOfficeRef = useRef<HTMLInputElement>(null);

  const fetchAgencyById = async (agencyId: string | string[] | undefined) => {
    const res = await fetch(`${process.env.backendAPI}/api/agency/${agencyId}`, { credentials: 'include' });
    if (!res.ok) {
      throw new Error('Agence introuvable');
    }
    return await res.json();
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchAgencyById(id)
      .then(data => {
        setAgency(data);
        setLoading(false);
      })
      .catch(() => {
        setAgency(null);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const formData = {
      ...agency,
      city: cityRef.current?.value || '',
      postal_code: Number(postalRef.current?.value) || 0,
      street: streetRef.current?.value || '',
      additional_info: addInfoRef.current?.value || '',
      phone: phoneRef.current?.value || '',
      head_office: Boolean(headOfficeRef.current?.checked),
    };

    try {
      const response = await fetch(`${process.env.backendAPI}/api/agency/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      const updated = await response.json();
      setAgency(updated);
      setEditMode(false);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Erreur inconnue');
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

  if (!agency) {
    return (
      <Layout>
        <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light text-center">
          <h1 className="mb-4">Détails de l'agence</h1>
          <p className="text-danger">Agence introuvable.</p>
          <Button variant="primary" onClick={() => router.push('/admin/agency/show')}>
            Retour à la liste
          </Button>
        </Container>
      </Layout>
    );
  }

  const isHeadOffice = agency.head_office === true

  return (
    <Layout>
      <Container className="py-5">
        <Row className="mb-3">
          <Col>
            <Button variant="dark" className="d-flex align-items-center gap-2" onClick={() => router.push('/admin/agency/show')}>
              <FaArrowLeft />
              Retour
            </Button>
          </Col>
        </Row>
        <h2 className="text-center mb-5">Détails de l'agence : {agency.city}</h2>
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
                        { label: 'Ville', value: agency.city },
                        { label: 'Code Postal', value: agency.postal_code },
                        { label: 'Rue', value: agency.street },
                        { label: "Complément d'adresse", value: agency.additional_info || '-' },
                        { label: 'Téléphone', value: agency.phone || '-' },
                        {
                          label: 'Siège social',
                          value: isHeadOffice ? (
                            <>
                              <FaCheckCircle className="text-success me-1" />
                              Oui
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="text-danger me-1" />
                              Non
                            </>
                          ),
                        },
                      ].map(({ label, value }, idx) => (
                        <Col md={6} key={idx} className="mb-3">
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
                          <Form.Label>Ville</Form.Label>
                          <Form.Control type="text" defaultValue={agency.city} ref={cityRef} required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Code Postal</Form.Label>
                          <Form.Control type="number" defaultValue={agency.postal_code} ref={postalRef} required />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Rue</Form.Label>
                          <Form.Control type="text" defaultValue={agency.street} ref={streetRef} required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Complément d'adresse</Form.Label>
                          <Form.Control type="text" defaultValue={agency.additional_info || ''} ref={addInfoRef} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Téléphone</Form.Label>
                          <Form.Control type="text" defaultValue={agency.phone} ref={phoneRef} required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Check
                            type="checkbox"
                            label={<span className="fw-bold text-white">Siège social</span>}
                            defaultChecked={isHeadOffice}
                            ref={headOfficeRef}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-center gap-3 mt-4">
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

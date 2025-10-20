import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../../components/Layout';
import {
    Card,
    Button,
    Form,
    Row,
    Col,
    Table,
    Container,
    Modal,
    Badge,
    FormControl,
    Spinner,
} from 'react-bootstrap';
import { FaPlus, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';

export default function AgencyManagement() {
    const router = useRouter();

    const [agencies, setAgencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const cityRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);
    const streetRef = useRef<HTMLInputElement>(null);
    const additionalInfoRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const headOfficeRef = useRef<HTMLInputElement>(null);

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.backendAPI}/api/agency`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setAgencies(data);
            } else {
                const data = await response.json();
                toast.error('Erreur serveur : ' + (data.message ?? 'Impossible de charger les agences'));
            }
        } catch (error) {
            toast.error('Erreur réseau lors du chargement des agences');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    // Filtrage simple par ville, postal code, rue
    const filteredAgencies = agencies.filter(a => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return (
            a.city?.toLowerCase().includes(lower) ||
            String(a.postal_code).includes(lower) ||
            a.street?.toLowerCase().includes(lower)
        );
    });

    const handleAddAgency = async () => {
        try {
            const agencyToAdd = {
                city: cityRef.current?.value || '',
                postal_code: parseInt(postalCodeRef.current?.value || '0', 10),
                street: streetRef.current?.value || '',
                additional_info: additionalInfoRef.current?.value || '',
                phone: phoneRef.current?.value || '',
                head_office: headOfficeRef.current?.checked || false,
            };

            const response = await fetch(`${process.env.backendAPI}/api/agency`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agencyToAdd),
            });

            if (response.ok) {
                const addedAgency = await response.json();
                setAgencies(prev => [...prev, addedAgency]);
                setShowModal(false);
                // reset inputs
                cityRef.current!.value = '';
                postalCodeRef.current!.value = '';
                streetRef.current!.value = '';
                additionalInfoRef.current!.value = '';
                phoneRef.current!.value = '';
                headOfficeRef.current!.checked = false;

                toast.success('Agence ajoutée avec succès !');
            } else {
                const errorData = await response.json();
                toast.error('Erreur lors de l\'ajout : ' + errorData.message);
            }
        } catch {
            toast.error('Erreur serveur lors de l\'ajout');
        }
    };

    const handleDeleteAgency = async (id: number) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette agence ?')) return;
        try {
            const response = await fetch(`${process.env.backendAPI}/api/agency/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                toast.success('Agence supprimée avec succès');
                fetchAgencies();
            } else {
                const data = await response.json();
                toast.error('Erreur lors de la suppression : ' + data.message);
            }
        } catch {
            toast.error('Erreur serveur lors de la suppression');
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <Container fluid className="py-4">
                <h1 className="mb-4">Gestion des agences</h1>
                <p className="mb-5 text-secondary fs-5">Gérez les agences de votre réseau ici.</p>

                <Row className="mb-4 g-3">
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-uppercase text-muted small">Total Agences</div>
                                    <div className="fs-3 fw-bold">{agencies.length}</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={8} className="mb-2 mb-md-0">
                        <FormControl
                            placeholder="Rechercher par ville, code postal, rue..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Recherche agences"
                            size="lg"
                        />
                    </Col>
                    <Col md={4} className="text-md-end">
                        <Button variant="purple" onClick={() => setShowModal(true)}>
                            <FaPlus className="me-2" />
                            Ajouter une agence
                        </Button>
                    </Col>
                </Row>

                <Card className="shadow-sm">
                    <Card.Header className="fw-bold">Liste des agences</Card.Header>
                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="py-5 text-center">
                                <Spinner animation="border" />
                            </div>
                        ) : filteredAgencies.length === 0 ? (
                            <div className="py-5 text-center text-muted">Aucune agence trouvée.</div>
                        ) : (
                            <Table responsive hover className="mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Ville</th>
                                        <th>Code Postal</th>
                                        <th>Rue</th>
                                        <th>Complément</th>
                                        <th>Téléphone</th>
                                        <th>Siège</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAgencies.map(agency => (
                                        <tr
                                            key={agency.id_agency}
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                const targetTag = (e.target as HTMLElement).tagName;
                                                if (targetTag !== 'BUTTON' && targetTag !== 'INPUT' && targetTag !== 'SVG' && targetTag !== 'PATH') {
                                                    router.push(`/admin/agency/${agency.id_agency}/detail/`);
                                                }
                                            }}
                                        >
                                            <td><a href="#">{`AG${agency.id_agency}`}</a></td>
                                            <td>{agency.city}</td>
                                            <td>{agency.postal_code}</td>
                                            <td>{agency.street}</td>
                                            <td>{agency.additional_info || '-'}</td>
                                            <td>{agency.phone || '-'}</td>
                                            <td className="text-center">
                                                {agency.head_office ? (
                                                    <Badge bg="success" className="d-inline-flex align-items-center">
                                                        <FaCheckCircle className="me-1" /> Oui
                                                    </Badge>
                                                ) : (
                                                    <Badge bg="secondary" className="d-inline-flex align-items-center">
                                                        <FaTimesCircle className="me-1" /> Non
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleDeleteAgency(agency.id_agency);
                                                    }}
                                                    title="Supprimer cette agence"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>

                {/* Add Agency Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton className="bg-purple text-white">
                        <Modal.Title>Ajouter une agence</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ville</Form.Label>
                                        <Form.Control type="text" placeholder="Entrez la ville" ref={cityRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Code Postal</Form.Label>
                                        <Form.Control type="text" placeholder="Entrez le code postal" ref={postalCodeRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Rue</Form.Label>
                                        <Form.Control type="text" placeholder="Entrez la rue" ref={streetRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Complément</Form.Label>
                                        <Form.Control type="text" placeholder="Entrez le complément d'adresse" ref={additionalInfoRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Téléphone</Form.Label>
                                        <Form.Control type="text" placeholder="Entrez le téléphone" ref={phoneRef} />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="d-flex align-items-center mt-3">
                                    <Form.Check type="checkbox" label="Siège" ref={headOfficeRef} />
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="yellow" onClick={handleAddAgency}>
                            Ajouter
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Layout>
    );
}

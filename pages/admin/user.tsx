import React from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Row, Col, FormControl, Table, Dropdown, Container } from 'react-bootstrap';
import { FaArrowCircleUp, FaSearch } from 'react-icons/fa';
import { FaArrowsRotate, FaFilter, FaPlus, FaAlignJustify } from "react-icons/fa6";

export default function Page() {
    const getAllUser = async () => {
        try {
            const response = await fetch(`${process.env.backendAPI}/api/user`, {
                method: 'GET',
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
                return data; // Return the user data
            }

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
   
    const [users, setUsers] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUser();
            if (data) {
                setUsers(data);
            }
        };
        fetchUsers();
    }, []);
  
    return (
        <Layout>
            <Container fluid>
                <h1 className="mb-4">Gestions des utilisateurs:</h1>
                <p className="mb-5 text-secondary fs-5 fs-sm-5 fs-md-4 fs-lg-3 fs-xl-2">Gérez les membres de votre équipe et leurs autorisations de compte ici.</p>
                {/* Liste utilisateur */}
                <div className="mb-4">
                    {/* ligne en grid avec 6 colonnes */}
                    <Row className="w-100 justify-content-between align-items-center fs-4 fs-sm-5 fs-md-4 fs-lg-3 fs-xl-2">
                        <Col xs={12} className="d-flex align-items-center flex-nowrap mb-3">
                            <h4 className="fs-2 fs-sm-3 fs-md-4 fs-lg-5 fs-xl-6">
                                Tous les utilisateurs <span className="text-secondary">{users.length}</span>
                            </h4>
                        </Col>
                        <Col xs={12} className="d-flex flex-wrap">
                            <Form className="d-flex me-2 mb-2 w-100">
                                <div className="position-relative w-100">
                                    <FormControl
                                        type="search"
                                        placeholder="Rechercher"
                                        className="py-3 pe-5 rounded-lg w-100"
                                        aria-label="Search"
                                    />
                                    <FaSearch
                                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary"
                                    />
                                </div>
                            </Form>
                        </Col>
                        <Col xs={12} className="d-flex justify-content-end flex-wrap">
                            <Button variant="secondary" className="me-2 mb-2 mb-md-0">
                                <FaArrowsRotate className="me-0 me-lg-2" />
                                <span className="d-lg-inline d-none">Annuler</span>
                            </Button>
                            <Dropdown className="me-2 mb-2 mb-md-0">
                                <Dropdown.Toggle variant="secondary" id="dropdown-filter">
                                    <FaFilter className="me-0 me-lg-2" />
                                    <span className="d-lg-inline d-none">Filtre</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#">Alphabétique A-Z</Dropdown.Item>
                                    <Dropdown.Item href="#">Alphabétique Z-A</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#">Actifs</Dropdown.Item>
                                    <Dropdown.Item href="#">Inactifs</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#">Inscription valider</Dropdown.Item>
                                    <Dropdown.Item href="#">Inscription en attente de validation</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12}>
                            <ul className="list-group mt-4 fs-4 fs-sm-5 fs-md-4 fs-lg-3 fs-xl-2">
                                {users && users.map((user, index) => (
                                    <li key={index} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center border-0 bg-light px-4 py-3 mb-3 rounded-3 shadow-sm">
                                        <Row className="w-100">
                                            <Col xs={12} md={4} className="d-flex align-items-center mb-3 mb-md-0">
                                                <div className="d-flex flex-column">
                                                    <h5 className="mb-0">{user.last_name.toUpperCase()} {user.first_name}</h5>
                                                    <p className="mb-0 text-secondary">{user.email}</p>
                                                </div>
                                            </Col>
                                            <Col xs={12} md={8} className="d-flex align-items-center justify-content-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="link" className="p-0 text-secondary">
                                                        <FaAlignJustify className="me-2 w-60 h-60" />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#">Valider l'inscription</Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item href="#">Désactiver</Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item href="#">Modifier</Dropdown.Item>
                                                        <Dropdown.Item href="#">Supprimer</Dropdown.Item>
                                                        <Dropdown.Item href="#">Réinitialiser le mot de passe</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                </div>
            </Container>
        </Layout>
    );
}

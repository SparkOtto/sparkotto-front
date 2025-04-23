import React from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Row, Col, FormControl, Table, Dropdown } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import { FaArrowCircleUp, FaSearch } from 'react-icons/fa';
import { FaArrowsRotate, FaFilter, FaPlus, FaAlignJustify } from "react-icons/fa6";

export default function Page() {
    return (
        <Layout>
            <div className="container py-4">
                <h1 className="mb-4">Gestions des utilisateurs:</h1>
                <p className="mb-5 text-secondary">Gérez les membres de votre équipe et leurs autorisations de compte ici.</p>

                {/* Liste utilisateur */}
                <div className="mb-4">
                    {/* ligne en grid avec 6 colonnes */}
                    <Row className="mb-4">
                        <Col xs={12} className="d-flex align-items-center flex-nowrap mb-3">
                            <h4 className="fs-6 fs-sm-5 fs-md-4 fs-lg-3 fs-xl-2">
                                Tous les utilisateurs <span className="text-secondary">08</span>
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
                                    <Dropdown.Item href="#">Actifs</Dropdown.Item>
                                    <Dropdown.Item href="#">Inactifs</Dropdown.Item>
                                    <Dropdown.Item href="#">Administrateurs</Dropdown.Item>
                                    <Dropdown.Item href="#">Utilisateurs</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button variant="black" className="mb-2 mb-md-0">
                                <FaPlus className="me-0 me-lg-2" />
                                <span className="d-lg-inline d-none">Ajouter un utilisateur</span>
                            </Button>
                        </Col>

                        <Col xs={12}>
                            <ul className="list-group mt-4">
                                {[...Array(8)].map((_, index) => (
                                    <li key={index} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center border-0 bg-light px-4 py-3 mb-3 rounded-3 shadow-sm">
                                        <Row className="w-100">
                                            <Col xs={12} md={4} className="d-flex align-items-center mb-3 mb-md-0">
                                                <img src="/images/logo.jpg" alt="user" className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
                                                <div className="d-flex flex-column">
                                                    <h5 className="mb-0">Nom Prénom</h5>
                                                    <p className="mb-0 text-secondary">email@email.com</p>
                                                </div>
                                            </Col>
                                            <Col xs={6} md={2} className="d-flex align-items-center justify-content-end mb-2 mb-md-0">
                                                <p className="mb-0">123456</p>
                                            </Col>
                                            <Col xs={6} md={2} className="d-flex align-items-center justify-content-end mb-2 mb-md-0">
                                                <p className="mb-0">01/01/2023</p>
                                            </Col>
                                            <Col xs={6} md={2} className="d-flex align-items-center justify-content-end mb-2 mb-md-0">
                                                <p className="mb-0">15/01/2023</p>
                                            </Col>
                                            <Col xs={12} md={2} className="d-flex align-items-center justify-content-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="link" className="p-0 text-secondary">
                                                        <FaAlignJustify className="me-2" />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#">Modifier</Dropdown.Item>
                                                        <Dropdown.Item href="#">Supprimer</Dropdown.Item>
                                                        <Dropdown.Item href="#">Désactiver</Dropdown.Item>
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
            </div>
        </Layout>
    );
}

import React from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Page() {
    return (
        <Layout>
            <div className="container py-4">
                {/* Barre de recherche */}
                <Form className="mb-4">
                    <Form.Control type="text" placeholder="Rechercher" className="p-2" />
                </Form>
                
                {/* Section Mes trajets à venir */}
                <div className="bg-light p-4 rounded">
                    <h4 className="mb-3">Mes trajets à venir :</h4>
                    <Row className="d-flex flex-wrap gap-2 justify-content-between">
                        {["Clio IV", "Zoe", "Peugeot"].map((car, index) => (
                            <Col>
                                <Card key={index} className="p-3">
                                    <Card.Body>
                                        <Card.Title>{car}</Card.Title>
                                        <Card.Text>📍 Rennes</Card.Text>
                                        <Card.Text>👤 John Doe</Card.Text>
                                        <Card.Text>Le 12/12/2021</Card.Text>
                                        <Button variant="yellow" className="w-100">Voir le trajet</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
                
                {/* Section Trouver une voiture */}
                <div className="mt-4 w5">
                    <h4 className="mb-3">Trouver une voiture</h4>
                    <FullCalendar
                        plugins={[ dayGridPlugin ]}
                        initialView="dayGridMonth"
                        weekends={false}
                        height="auto"
                        events={[
                            { title: 'Réservation Clio IV', date: '2025-03-13' },
                            { title: 'Réservation Zoe', date: '2025-03-14' }
                        ]}
                    />
                </div>
            </div>
        </Layout>
    );
}

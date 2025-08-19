import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, Row, Col, Container, Dropdown, ButtonGroup, Badge } from 'react-bootstrap';

export default function Page() {
    // Fetch all users
    const getAllUsers = async () => {
        try {
            const response = await fetch(`${process.env.backendAPI}/api/user`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const data = await response.json();
                if (response.status === 500) {
                    console.error('Server error:', data.message);
                    return;
                }
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshUsers = async () => {
        setLoading(true);
        const data = await getAllUsers();
        if (data) setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    // API calls for user actions
    const toggleUserStatus = async (userId: number, isActive: boolean) => {
        try {
            const response = await fetch(`${process.env.backendAPI}/api/admin/toggleUserStatus/${userId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive }),
            });
            if (!response.ok) {
                const data = await response.json();
                console.error('Error toggling user status:', data.message);
            } else {
                await refreshUsers();
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const lockUnlockUser = async (userId: number, isLocked: boolean) => {
        try {
            const response = await fetch(`${process.env.backendAPI}/api/admin/lockUnlockUser`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, isLocked }),
            });
            if (!response.ok) {
                const data = await response.json();
                console.error('Error locking/unlocking user:', data.message);
            } else {
                await refreshUsers();
            }
        } catch (error) {
            console.error('Error locking/unlocking user:', error);
        }
    };



    // Handlers for actions
    const handleActivate = (userId: number) => {
        toggleUserStatus(userId, true);
    };
    const handleDeactivate = (userId: number) => {
        toggleUserStatus(userId, false);
    };
    const handleBlock = (userId: number) => {
        lockUnlockUser(userId, true);
    };
    const handleUnblock = (userId: number) => {
        lockUnlockUser(userId, false);
    };

    // Helper to get status badge
    const getStatusBadge = (user: any) => {
        if (user.account_locked) {
            return <Badge bg="danger">Bloqué</Badge>;
        }
        if (user.active) {
            return <Badge bg="success">Activé</Badge>;
        }
        return <Badge bg="secondary">Désactivé</Badge>;
    };

    return (
        <Layout>
            <Container fluid>
                <h1 className="mb-4">Gestion des utilisateurs :</h1>
                <p className="mb-5 text-secondary fs-5">Gérez les membres de votre équipe et leurs autorisations ici.</p>
                <div className="mb-4">
                    <Row className="w-100 justify-content-between align-items-center">
                        <Col xs={6} className="d-flex align-items-center flex-nowrap mb-3">
                            <h4 className="fs-2">Tous les utilisateurs</h4>
                        </Col>
                        <Col xs={12} className="d-flex flex-wrap gap-3 mb-4 dashboard-cards-row">
                            <Card className="dashboard-card dashboard-card-dark flex-grow-1">
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="dashboard-card-title">Total Utilisateurs</span>
                                    </div>
                                    <div className="dashboard-card-value mt-2">{users.length}</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <div className="table-container">
                                <table className="sparkotto-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nom</th>
                                            <th>Prénom</th>
                                            <th>Email</th>
                                            <th>Statut</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td>{`U${user.id_user}`}</td>
                                                <td>{user.last_name}</td>
                                                <td>{user.first_name}</td>
                                                <td>{user.email}</td>
                                                <td>{getStatusBadge(user)}</td>
                                                <td>
                                                    <Dropdown as={ButtonGroup}>
                                                        <Dropdown.Toggle variant="outline-secondary" size="sm" id={`dropdown-${user.id_user}`}>
                                                            <span className="me-1">⋮</span>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {!user.active && !user.account_locked && (
                                                                <Dropdown.Item onClick={() => handleActivate(user.id_user)}>
                                                                    Activer le compte
                                                                </Dropdown.Item>
                                                            )}
                                                            {user.active && !user.account_locked && (
                                                                <Dropdown.Item onClick={() => handleDeactivate(user.id_user)}>
                                                                    Désactiver le compte
                                                                </Dropdown.Item>
                                                            )}
                                                            <Dropdown.Divider />
                                                            {!user.account_locked ? (
                                                                <Dropdown.Item onClick={() => handleBlock(user.id_user)}>
                                                                    Bloquer le compte
                                                                </Dropdown.Item>
                                                            ) : (
                                                                <Dropdown.Item onClick={() => handleUnblock(user.id_user)}>
                                                                    Débloquer le compte
                                                                </Dropdown.Item>
                                                            )}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {loading && <div className="mt-3 text-center">Chargement...</div>}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </Layout>
    );
}

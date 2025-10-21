import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import {
  Card,
  Button,
  Table,
  Badge,
  Container,
  Stack,
  Spinner,
  Form,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaUnlock,
  FaUserSlash,
  FaUserCheck,
  FaUsers,
  FaUserTimes,
  FaUserLock,
} from "react-icons/fa";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

export default function Page() {
  const [userActive, setUser] = useState({ first_name: '', last_name: '', email: '', phone_number: '', id: '' });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtres & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "locked">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const USERS_PER_PAGE = 10;

  // API Fetch
  const getAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.backendAPI}/api/user`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 500) {
          console.error("Server error:", data.message);
          return [];
        }
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const refreshUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
    refreshUsers();
  }, []);

  // Actions API
  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    if(userActive.id === userId.toString()) {
      toast.error("Vous ne pouvez pas activer ou désactiver votre propre compte.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.backendAPI}/api/admin/toggleUserStatus/${userId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        console.error("Error toggling status:", data.message);
      } else {
        refreshUsers();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const lockUnlockUser = async (userId: number, isLocked: boolean) => {
    try {
      if(userActive.id === userId.toString()) {
        toast.error("Vous ne pouvez pas bloquer ou débloquer votre propre compte.");
        return;
      }
      const response = await fetch(`${process.env.backendAPI}/api/admin/lockUnlockUser`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isLocked }),
      });
      if (!response.ok) {
        const data = await response.json();
        console.error("Error locking/unlocking user:", data.message);
      } else {
        refreshUsers();
      }
    } catch (error) {
      console.error("Error locking/unlocking user:", error);
    }
  };

  // Badges status
  const renderStatusBadge = (user: any) => {
    if (user.account_locked) {
      return (
        <Badge bg="danger" className="text-uppercase">
          Bloqué
        </Badge>
      );
    }
    if (user.active) {
      return (
        <Badge bg="success" className="text-uppercase">
          Activé
        </Badge>
      );
    }
    return (
      <Badge bg="secondary" className="text-uppercase">
        Désactivé
      </Badge>
    );
  };

  // Filtrage selon recherche + status
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullText = (user.last_name + " " + user.first_name + " " + user.email).toLowerCase();
      if (!fullText.includes(searchTerm.toLowerCase())) return false;

      if (filterStatus === "active" && (!user.active || user.account_locked)) return false;
      if (filterStatus === "inactive" && user.active) return false;
      if (filterStatus === "locked" && !user.account_locked) return false;

      return true;
    });
  }, [users, searchTerm, filterStatus]);

  // Pagination slice
  const pageCount = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const pagedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // Statistiques générales
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active && !u.account_locked).length;
  const inactiveUsers = users.filter((u) => !u.active && !u.account_locked).length;
  const lockedUsers = users.filter((u) => u.account_locked).length;

  // Gestion pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pageCount) setCurrentPage(page);
  };

  return (
    <Layout>
      <Container fluid className="py-4">
        <h2 className="fw-bold mb-4">Gestion des utilisateurs</h2>

        {/* Dashboard Stats */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-uppercase text-muted small">Total utilisateurs</div>
                  <div className="fs-3 fw-bold">{totalUsers}</div>
                </div>

                <FaUsers size={36} className="text-primary" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-uppercase text-muted small">Activés</div>
                  <div className="fs-3 fw-bold">{activeUsers}</div>
                </div>
                <FaUserCheck size={36} className="text-success" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-uppercase text-muted small">Désactivés</div>
                  <div className="fs-3 fw-bold">{inactiveUsers}</div>
                </div>
                <FaUserTimes size={36} className="text-secondary" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-uppercase text-muted small">Bloqués</div>
                  <div className="fs-3 fw-bold">{lockedUsers}</div>
                </div>
                <FaUserLock size={36} className="text-danger" />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtres */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center g-3">
              <Col md={6} lg={4}>
                <Form.Control
                  type="search"
                  placeholder="Rechercher nom, prénom ou email"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Recherche utilisateur"
                />
              </Col>
              <Col md={6} lg={4}>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  aria-label="Filtrer par statut"
                >
                  <option value="all">Tous statuts</option>
                  <option value="active">Comptes activés</option>
                  <option value="inactive">Comptes non activés</option>
                  <option value="locked">Comptes bloqués</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tableau utilisateurs */}
        <Card className="shadow-sm">
          <Card.Header className="fw-bold">
            Utilisateurs (affichés: {filteredUsers.length})
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-5 text-muted">Aucun utilisateur trouvé.</div>
            ) : (
              <>
                <Table responsive hover className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nom Prénom</th>
                      <th>Email</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedUsers.map((user, index) => (
                      <tr key={user.id_user}>
                        <td>{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                        <td>
                          <strong>
                            {user.last_name} {user.first_name}
                          </strong>
                        </td>
                        <td>
                          <a href={`mailto:${user.email}`} className="text-decoration-none">
                            {user.email}
                          </a>
                        </td>
                        <td>{renderStatusBadge(user)}</td>
                        <td>
                          <Stack direction="horizontal" gap={2}>
                            {!user.account_locked && !user.active && userActive.id !== user.id_user && (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => toggleUserStatus(user.id_user, true)}
                                title="Activer le compte"
                              >
                                <FaUserCheck />
                              </Button>
                            )}
                            {!user.account_locked && user.active && userActive.id !== user.id_user && (
                              <Button
                                size="sm"
                                variant="outline-warning"
                                onClick={() => toggleUserStatus(user.id_user, false)}
                                title="Désactiver le compte"
                              >
                                <FaUserSlash />
                              </Button>
                            )}
                            {!user.account_locked && userActive.id !== user.id_user && (
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => lockUnlockUser(user.id_user, true)}
                                title="Bloquer le compte"
                              >
                                <FaLock />
                              </Button>
                            )}
                            {user.account_locked && userActive.id !== user.id_user && (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => lockUnlockUser(user.id_user, false)}
                                title="Débloquer le compte"
                              >
                                <FaLock />
                              </Button>
                            )}
                            {userActive.id === user.id_user && (
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled
                                title="Vous ne pouvez pas cliquer sur ce bouton"
                              >
                                <FaUserSlash />
                              </Button>
                            )}
                            {userActive.id === user.id_user && (
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled
                                title="Vous ne pouvez pas cliquer sur ce bouton"
                              >
                                <FaLock />
                              </Button>
                            )}
                          </Stack>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Pagination affichée seulement si plusieurs pages */}
                {pageCount > 1 && (
                  <Pagination className="my-3 justify-content-center">
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                      <Pagination.Item key={p} active={p === currentPage} onClick={() => handlePageChange(p)}>
                        {p}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageCount} />
                    <Pagination.Last onClick={() => handlePageChange(pageCount)} disabled={currentPage === pageCount} />
                  </Pagination>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

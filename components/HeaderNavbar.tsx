import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Navbar, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { FaCalendarDays } from 'react-icons/fa6';

export default function CustomNavbar() {

  const [user, setUser] = React.useState({ first_name: 'John', last_name: 'Doe' });
  const [userRole, setUserRole] = React.useState(null);
  const [showConfirm, setShowConfirm] = React.useState(false);

  React.useEffect(() => {
    const Cookies = require('js-cookie');
    const userCookie = Cookies.get('user');
    let userRole = null;
    if (userCookie) {
      setUser(JSON.parse(userCookie));
      const userValue = typeof userCookie === 'object' && userCookie.value ? userCookie.value : userCookie;
      try {
        userRole = JSON.parse(String(userValue)).role.role_name;
      } catch (e) {
        userRole = null;
      }
      setUserRole(userRole);
    }
  }, []);

  // appel API pour le logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.backendAPI}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const Cookies = require('js-cookie');
        Cookies.remove('user');
        window.location.href = '/';
      }

    } catch (e) {
      console.error('Error logging out:', e);
    }
  };

  return (
    <Navbar className='p-4'>
      <Container fluid>
            <Row className="w-100">
              <Col className="d-flex justify-content-end align-items-center gap-3">

                <div className="d-flex flex-column align-items-end">
                  <button
                  id="calendar-link"
                  className="btn btn-link text-dark d-flex align-items-center p-0"
                  onClick={() => setShowConfirm(true)}
                  >
                  <FaCalendarDays size={23} />
                  </button>
                  {showConfirm && (
                  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
                    <div className="bg-white rounded shadow p-4" style={{ minWidth: '300px' }}>
                    <p className="mb-4">Voulez-vous vraiment être redirigé vers le dashboard&nbsp;?</p>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                      className="btn btn-secondary"
                      onClick={() => setShowConfirm(false)}
                      >
                      Annuler
                      </button>
                      <button
                      className="btn btn-primary"
                      onClick={() => {
                        setShowConfirm(false);
                        window.location.href = "/dashboard";
                      }}
                      >
                      Continuer
                      </button>
                    </div>
                    </div>
                  </div>
                  )}
                </div>
                <Dropdown>
                  <Dropdown.Toggle as="div" className="d-flex align-items-center justify-content-center bg-black px-3 py-1 rounded-pill cursor-pointer text-white border-0">
                    <span className="d-lg-inline d-none">
                      {user.last_name.split(' ').map(name => name.toUpperCase()).join(' ')} {user.first_name}
                    </span>
                    <span className="d-inline d-lg-none">
                      {user.first_name[0].toUpperCase()}
                      {user.last_name.split(' ').map(name => name[0].toUpperCase()).join('')}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {userRole === 'admin' && (
                      <Dropdown.Item as={Link} href="/admin/user" className="text-decoration-none text-dark">
                        Administration
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} href="/profile" className="text-decoration-none text-dark">
                      Mon profil
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="text-decoration-none text-dark"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
      </Container>
    </Navbar>

  );
}
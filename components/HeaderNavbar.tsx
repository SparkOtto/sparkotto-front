import Link from 'next/link';
import React from 'react';
import { Navbar, Form, FormControl, Button, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { FaBell, FaQuestionCircle, FaSearch } from 'react-icons/fa';

export default function CustomNavbar() {

  const [user, setUser] = React.useState({ first_name: 'John', last_name: 'Doe' });
  const [userRole, setUserRole] = React.useState(null);

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

  return (
    <Navbar className='p-4'>
      <Container fluid>
        <Row className="w-100 justify-content-between align-items-center">
          <Col lg={6} xl={5} className="mb-3 mb-xl-0">
            <Form className="d-flex mx-auto">
              <FormControl type="search" placeholder="Rechercher" className="me-2 py-3" aria-label="Search" />
              <Button variant="outline-secondary">
                <FaSearch />
              </Button>
            </Form>
          </Col>
          <Col lg={6} xl={7}>
            <Row className="justify-content-end align-items-center flex-nowrap">
              <Col xs="auto" className="d-flex gap-4">
                <FaQuestionCircle size={20} />
                <FaBell size={20} />
              </Col>
              <Col xs="auto">
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
                      <Dropdown.Item>
                        <Link href="/admin/user" className="text-decoration-none text-dark">
                          Administration
                        </Link>
                      </Dropdown.Item>
                    )}
                  <Dropdown.Divider />
                  <Dropdown.Item>
                    <Link href="/profile" className="text-decoration-none text-dark">
                        Mon profil
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item className="text-decoration-none text-dark" onClick={() => {
                    const Cookies = require('js-cookie');
                    Cookies.remove('user');
                    Cookies.remove('token');
                    window.location.href = '/';
                  }}>Déconnexion</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Navbar>

  );
}
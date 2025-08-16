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
            <Row className="w-100">
              <Col className="d-flex justify-content-end align-items-center">
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
                      onClick={() => {
                        const Cookies = require('js-cookie');
                        Cookies.remove('user');
                        Cookies.remove('token');
                        window.location.href = '/';
                      }}
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
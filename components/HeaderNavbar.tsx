import React from 'react';
import { Navbar, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';
import { FaBell, FaQuestionCircle, FaSearch } from 'react-icons/fa';

export default function CustomNavbar() {

  const [user, setUser] = React.useState({ first_name: 'John', last_name: 'Doe' });

  React.useEffect(() => {
    const Cookies = require('js-cookie');
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUser(JSON.parse(userCookie));
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
                <div className="d-flex align-items-center justify-content-center bg-black px-3 py-1 rounded-pill text-white">
                <span className="d-lg-inline d-none">
                  {user.last_name.split(' ').map(name => name.toUpperCase()).join(' ')} {user.first_name}
                </span>
                <span className="d-inline d-lg-none">
                  {user.first_name[0].toUpperCase()}
                  {user.last_name.split(' ').map(name => name[0].toUpperCase()).join('')}
                </span>
                </div>
                </Col>
            </Row>
            </Col>
        </Row>
      </Container>
    </Navbar>

  );
}
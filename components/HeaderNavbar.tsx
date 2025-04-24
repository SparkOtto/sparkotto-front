import { Navbar, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { FaBell, FaQuestionCircle, FaSearch } from 'react-icons/fa';
import SparkLogo from '../public/images/logo.jpg';

export default function CustomNavbar() {
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
            <Row className="justify-content-end align-items-center">
              <Col xs="auto" className="d-flex gap-4 mb-3 mb-xl-0">
                <FaQuestionCircle size={20} />
                <FaBell size={20} />
              </Col>
              <Col xs="auto">
                <div className="d-flex align-items-center justify-content-between gap-4 bg-black px-3 py-3 rounded-pill text-white">
                  <Image src={SparkLogo} alt="User" width={40} height={40} className="rounded-circle" />
                  <span className="d-none d-xl-inline">John Doe</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Navbar>

  );
}
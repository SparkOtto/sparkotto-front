import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './Logo';

export default function Sidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const SidebarContent = () => (
    <>
      <div className="text-center mb-4">
        <Logo />
      </div>
      <Nav className="flex-column">
        <Button variant="yellow" className="mb-3 text-dark">
          Réserver un Véhicule
        </Button>
        <Button variant="yellow" className="mb-3 text-dark">
          Ajouter un véhicule
        </Button>
        <Button variant="yellow" className="mb-3 text-dark">
          Mes trajets à venir
        </Button>
      </Nav>
    </>
  );

  return (
    <>
      <Navbar bg="purple" expand={false} className="mb-3 d-md-none">
        <Container fluid>
          <Navbar.Brand href="#"><Logo /></Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} className="bg-yellow" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            show={show}
            onHide={handleClose}
            className="bg-purple relative"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel"></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <SidebarContent />
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="d-none d-md-flex flex-column bg-purple vh-100 p-3">
        <SidebarContent />
      </div>
    </>
  );
}

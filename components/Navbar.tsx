import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const router = useRouter();

  const SidebarContent = () => (
    <>
      <div className="text-center mb-4">
        <Link href="/" className="text-decoration-none text-white">
            <Logo />
        </Link>
      </div>
      <Nav className="flex-column">
        {router.pathname.startsWith('/admin') ? (
          <>
            <Button variant="yellow" className="mb-3 text-dark" onClick={() => router.push('/admin/user')}>
              Gérer les utilisateurs
            </Button>
            <Button variant="yellow" className="mb-3 text-dark" onClick={() => router.push('/admin/car')}>
              Gérer les véhicules
            </Button>
          </>
        ) : (
          <>
            <Button variant="yellow" className="mb-3 text-dark">
              Réserver un Véhicule
            </Button>
            <Button variant="yellow" className="mb-3 text-dark">
              Ajouter un véhicule
            </Button>
            <Button variant="yellow" className="mb-3 text-dark">
              Mes trajets à venir
            </Button>
          </>
        )}
      </Nav>
      <div className="mt-auto text-center">
        <Button variant="light" className="d-flex align-items-center">
          Aide
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Navbar bg="purple" expand={false} className="mb-3 d-lg-none">
        <Container fluid>
          <Navbar.Brand>
            <Link href="/" className="text-decoration-none text-white">
              <Logo />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} className="bg-yellow" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            show={show}
            onHide={handleClose}
            className="bg-purple"
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

      <div className="d-none d-lg-flex flex-column bg-purple vh-100 p-3">
        <SidebarContent />
      </div>
    </>
  );
}

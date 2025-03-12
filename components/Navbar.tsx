import Nav from 'react-bootstrap/Nav';

export default function Navbar() {
  return (
    <Nav defaultActiveKey="/home" className="flex-column bg-primary">
      <Nav.Link href="/home">Active</Nav.Link>
      <Nav.Link eventKey="link-1">Link</Nav.Link>
      <Nav.Link eventKey="link-2">Link</Nav.Link>
      <Nav.Link eventKey="disabled" disabled>
        Disabled
      </Nav.Link>
    </Nav>
  );
}


import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSpring } from '@react-spring/web';
import { animated } from '@react-spring/web';

const NavLink = ({ to, children }) => {
  const [hover, setHover] = useState(false);
  const pop = useSpring({
    transform: hover ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 300, friction: 10 }
  });

  return (
    <LinkContainer to={to} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <animated.div style={pop}>
        <Nav.Link>{children}</Nav.Link>
      </animated.div>
    </LinkContainer>
  );
};

const NavigationBar = () => {
  return (
    <Navbar bg="info" variant="light" expand="lg">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>Security Dashboard</Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/package-vetting">Package Vetting</NavLink>
            <NavLink to="/secrets-hygiene">Secrets Hygiene</NavLink>
            <NavLink to="/cloud-misconfiguration">Cloud Misconfiguration</NavLink>
            <NavLink to="/iam-analyzer">IAM Analyzer</NavLink>
            <NavLink to="/anomaly-detector">Anomaly Detector</NavLink>
            <NavLink to="/compliance-dashboard">Compliance Dashboard</NavLink>
            <NavLink to="/shadow-it-detector">Shadow IT Detector</NavLink>
          </Nav>
          <Nav>
            <NavDropdown title={<img src="https://via.placeholder.com/30" alt="user" className="rounded-circle" />} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Setting</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Dark/Light toggle</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

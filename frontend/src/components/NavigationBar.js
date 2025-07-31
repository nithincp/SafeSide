import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSpring, animated } from '@react-spring/web';

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
    <Navbar bg="dark" variant="dark" expand="lg">
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

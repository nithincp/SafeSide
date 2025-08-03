import React, { useState, useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSpring, animated } from '@react-spring/web';
import { ThemeContext } from '../context/ThemeContext';

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
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Navbar bg={theme === 'light' ? 'info' : 'dark'} variant={theme === 'light' ? 'light' : 'dark'} expand="lg">
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
            <NavDropdown title={<img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="30" height="30" alt="user" className="rounded-circle" />} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Setting</NavDropdown.Item>
              <NavDropdown.Item onClick={toggleTheme}>
                {theme === 'light' ? 'Dark' : 'Light'} Mode
              </NavDropdown.Item>
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

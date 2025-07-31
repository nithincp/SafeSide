import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Security Dashboard</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/package-vetting">
              <Nav.Link>Package Vetting</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/secrets-hygiene">
              <Nav.Link>Secrets Hygiene</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/cloud-misconfiguration">
              <Nav.Link>Cloud Misconfiguration</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/iam-analyzer">
              <Nav.Link>IAM Analyzer</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/anomaly-detector">
              <Nav.Link>Anomaly Detector</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/compliance-dashboard">
              <Nav.Link>Compliance Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/shadow-it-detector">
              <Nav.Link>Shadow IT Detector</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

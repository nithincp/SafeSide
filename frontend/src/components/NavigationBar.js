import React, { useState, useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSpring, animated } from "@react-spring/web";
import { ThemeContext } from '../context/ThemeContext';

const AnimatedNavItem = ({ to, children }) => {
  const [hover, setHover] = useState(false);
  const pop = useSpring({
    transform: hover ? "scale(1.1)" : "scale(1)",
    config: { tension: 300, friction: 10 },
  });

  return (
    <LinkContainer to={to}>
      <animated.div
        style={pop}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <NavDropdown.Item>{children}</NavDropdown.Item>
      </animated.div>
    </LinkContainer>
  );
};

const NavigationBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const menuItems = [
    "Package Vetting",
    "Secrets Hygiene",
    "Cloud Misconfiguration",
    "IAM Analyzer",
    "Anomaly Detector",
    "Compliance Dashboard",
    "Shadow IT Detector",
  ];

  const toKebabCase = (str) => str.toLowerCase().replace(/\s+/g, "-");

  return (
    <Navbar bg={theme === 'light' ? 'info' : 'dark'} variant={theme === 'light' ? 'light' : 'dark'} expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">SafeSide</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {menuItems.map((item) => {
              const basePath = `/${toKebabCase(item)}`;
              return (
                <NavDropdown
                  title={item}
                  id={`nav-dropdown-${toKebabCase(item)}`}
                  key={item}
                >
                  <AnimatedNavItem to={`${basePath}/option1`}>
                    {item} - Option1
                  </AnimatedNavItem>
                  <AnimatedNavItem to={`${basePath}/option2`}>
                    {item} - Option2
                  </AnimatedNavItem>
                  <AnimatedNavItem to={`${basePath}/option3`}>
                    {item} - Option3
                  </AnimatedNavItem>
                </NavDropdown>
              );
            })}
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  width="30"
                  height="30"
                  alt="user"
                  className="rounded-circle"
                />
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
              <NavDropdown.Item onClick={toggleTheme}>
                {theme === 'light' ? 'Dark' : 'Light'}
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

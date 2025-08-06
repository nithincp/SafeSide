import React, { useContext } from 'react';
import { Button, Container } from "react-bootstrap";
import { useSpring } from "@react-spring/web";
import { animated } from "@react-spring/web";
import { ThemeContext } from '../context/ThemeContext';

const LandingPage = () => {
  const { theme } = useContext(ThemeContext);

  const jumbotronStyle = {
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: theme === 'light' ? "#e9ecef" : "#495057",
    borderRadius: ".3rem",
  };

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  const buttonSpring = useSpring({
    from: { transform: "scale(0.8)" },
    to: { transform: "scale(1)" },
    config: { tension: 300, friction: 10 },
  });

  return (
    <Container className="mt-2 px-2">
      <animated.div style={{ ...jumbotronStyle, ...fadeIn }}>
        <h1>Welcome to the SafeSide!</h1>
        <p>
          This is a comprehensive security tool that helps you to identify and
          mitigate security risks in your applications and infrastructure within
          the organization
        </p>
        <p>
          <animated.div style={buttonSpring}>
            <Button variant="primary">Learn more</Button>
          </animated.div>
        </p>
      </animated.div>
    </Container>
  );
};

export default LandingPage;

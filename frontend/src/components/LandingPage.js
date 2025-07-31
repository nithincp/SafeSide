import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';

const LandingPage = () => {
  const jumbotronStyle = {
    padding: '2rem 1rem',
    marginBottom: '2rem',
    backgroundColor: '#e9ecef',
    borderRadius: '.3rem'
  };

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 }
  });

  const buttonSpring = useSpring({
    from: { transform: 'scale(0.8)' },
    to: { transform: 'scale(1)' },
    config: { tension: 300, friction: 10 }
  });

  return (
    <Container className="mt-5">
      <animated.div style={{...jumbotronStyle, ...fadeIn}}>
        <h1>Welcome to the Security Dashboard!</h1>
        <p>
          This is a comprehensive security tool that helps you to identify and mitigate security risks in your applications and infrastructure.
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

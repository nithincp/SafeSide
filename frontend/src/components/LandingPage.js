import React from 'react';
import { Button, Container } from 'react-bootstrap';

const LandingPage = () => {
  const jumbotronStyle = {
    padding: '2rem 1rem',
    marginBottom: '2rem',
    backgroundColor: '#e9ecef',
    borderRadius: '.3rem'
  };

  return (
    <Container className="mt-5">
      <div style={jumbotronStyle}>
        <h1>Welcome to the Security Dashboard!</h1>
        <p>
          This is a comprehensive security tool that helps you to identify and mitigate security risks in your applications and infrastructure.
        </p>
        <p>
          <Button variant="primary">Learn more</Button>
        </p>
      </div>
    </Container>
  );
};

export default LandingPage;

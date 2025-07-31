import React from 'react';
import { Jumbotron, Button, Container } from 'react-bootstrap';

const LandingPage = () => {
  return (
    <Container className="mt-5">
      <Jumbotron>
        <h1>Welcome to the Security Dashboard!</h1>
        <p>
          This is a comprehensive security tool that helps you to identify and mitigate security risks in your applications and infrastructure.
        </p>
        <p>
          <Button variant="primary">Learn more</Button>
        </p>
      </Jumbotron>
    </Container>
  );
};

export default LandingPage;

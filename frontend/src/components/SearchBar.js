import React from "react";
import { Container, Form, Button } from "react-bootstrap";

const SearchBar = () => {
  return (
    <Container className="mt-3 mb-2">
      <div className="d-flex justify-content-end">
        <Form className="d-flex" style={{ maxWidth: "400px", width: "100%" }}>
          <Form.Control
            type="search"
            placeholder="Search..."
            className="me-2"
          />
          <Button variant="primary">Go</Button>
        </Form>
      </div>
    </Container>
  );
};

export default SearchBar;

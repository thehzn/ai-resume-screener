import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Unauthorised = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="text-center shadow-lg p-5 bg-white rounded-4 border">
        <Col>
          <div className="mb-4">
            {/* Using an Emoji or a Bootstrap Icon */}
            <span style={{ fontSize: '5rem' }} role="img" aria-label="locked">
              🚫
            </span>
          </div>
          <h1 className="display-4 fw-bold text-danger">Access Denied</h1>
          <h3 className="mb-3 text-dark">403 - Forbidden</h3>
          <p className="text-muted mb-4">
            Sorry! You do not have the necessary permissions to view this page. 
            This area is restricted to <strong>Administrators</strong> only.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
            <Button 
              variant="outline-secondary" 
              size="lg" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorised;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();


    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { email, password } = formData;

        fetch('http://localhost:7000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email, password
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('user', data.token);
                    navigate('/home');
                } else {
                    window.alert(data.error)
                }

            })
            .catch((err) => {
                window.alert(err.message);
            });
    };





    return (
        <Container fluid className="h-100">
            <Row className="h-100">
                <Col md={5} className="d-flex justify-content-center align-items-center bg-light">
                    <div className="text-center">
                        <h1>LOGO</h1>
                        <p>Enter your credentials to access your account</p>
                    </div>
                </Col>
                <Col md={7} className="d-flex justify-content-center align-items-center">
                    <div className="w-75">
                        <h2 className="mb-4">Login</h2>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Sign in
                            </Button>
                        </Form>
                        <p className="mt-3">
                            Don't have an account? <a href="/signup">Sign up</a>
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

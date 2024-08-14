import { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api.ts';
import logo from '../../assets/logo.png';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username, password });
            localStorage.setItem('token', JSON.stringify(response.data));
            navigate('/chat');
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert('Login failed (' + error.message + ')');
            } else {
                alert('Login failed due to an unknown error');
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mt-5">QChat</h2>
                    <div className="text-center mb-5">Instant Messaging</div>
                    <Card className="my-5 cardbody-color">
                        <Form className="card-body p-lg-5">
                            <div className="text-center">
                                <img
                                    src={logo}
                                    className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                    width="200px"
                                    alt="profile"
                                />
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="User Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <div className="text-center">
                                <Button
                                    type="button"
                                    className="btn btn-color px-5 mb-5 w-100"
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            </div>

                            <div className="form-text text-center mb-5">
                                Not Registered? <a href="/register" className="fw-bold">Create an Account</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;

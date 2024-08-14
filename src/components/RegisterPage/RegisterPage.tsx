import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form, Button, Container, Row, Col, Card} from 'react-bootstrap';
import {registerUser} from '../../services/api.ts';
import logo from '../../assets/logo.png';
import './RegisterPage.css';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isValid = username.trim() !== '' && password.trim() !== '' && firstName.trim() !== '' && lastName.trim() !== '';
        setIsFormValid(isValid);
    }, [username, password, firstName, lastName]);

    const handleRegister = () => {
        if (isFormValid) {
            registerUser({username, password, first_name: firstName, last_name: lastName})
                .then(() => {
                    navigate('/login');
                })
                .catch(() => {
                    alert('Registration failed');
                });
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mt-5">Register</h2>
                    <div className="text-center mb-5">Join QChat</div>
                    <Card className="my-5 cardbody-color">
                        <Form className="card-body p-lg-5">
                            <div className="text-center">
                                <img
                                    src={logo}
                                    className="img-fluid logo img-thumbnail rounded-circle my-3"
                                    width="200px"
                                    alt="profile"
                                />
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <div className="text-center">
                                <Button
                                    type="button"
                                    className="btn btn-color px-5 mb-5 w-100"
                                    onClick={handleRegister}
                                    disabled={!isFormValid}>
                                    Register
                                </Button>
                            </div>

                            <div className="form-text text-center mb-5">
                                Already Registered? <a href="/login" className="fw-bold">Login Here</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterPage;

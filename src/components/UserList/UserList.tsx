import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Col, Container, ListGroup, Row, Image, Button} from "react-bootstrap";
import {getUsers, logoutUser, User} from '../../services/api.ts';
import useWebSocket from '../../hooks/useWebSocket.ts';
import profilePic from '../../assets/profile-pic.png';
import userProfilePic from '../../assets/user-profile-pic.png';
import './UserList.css'

interface UserListProps {
    onUserSelect: (user: User) => void;
    selectedUserId: string | undefined;
    onlineUsers: string[];
    setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

function UserList({onUserSelect, selectedUserId, onlineUsers, setOnlineUsers}: UserListProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const socket = useWebSocket();
    const navigate = useNavigate();

    const storedToken = localStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken) : null;
    const userId = token?.user?.id;
    const authToken = token?.token;

    useEffect(() => {
        if (!storedToken) return;
        setCurrentUser(token.user);

        getUsers(authToken, userId)
            .then((response) => {
                setUsers(response.data);
                const initialOnlineUsers = response.data
                    .filter((user: User) => user.online_status)
                    .map((user: User) => user.id);

                setOnlineUsers(initialOnlineUsers);
            })
            .catch(() => {
                alert('Failed to fetch users:');
            });
    }, []);

    const handleLogout = () => {
        logoutUser(authToken, userId)
            .then((response) => {
                if (response?.status === 200) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
            .catch(() => {
                alert('Failed to log out:');
            });
    };

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data); //debug

            if (data.type === 'user_online') {
                setOnlineUsers((prev) => {
                    if (!prev.includes(data.user_id)) {
                        return [...prev, data.user_id];
                    }
                    return prev;
                });
            } else if (data.type === 'user_offline') {
                setOnlineUsers((prev) => prev.filter((id) => id !== data.user_id));
            }
        };

        return () => {
            socket.onmessage = null;
        };
    }, [socket]);

    return (
        <Container className="user-list-container p-3 bg-light border-right" fluid>
            <Row className="align-items-center mb-3">
                <Col xs={3}>
                    <Image
                        src={userProfilePic}
                        roundedCircle
                        fluid
                    />
                </Col>
                <Col xs={9}>
                    <h6 className="mb-0">{currentUser?.first_name + ' ' + currentUser?.last_name}</h6>
                    <small className="text-muted">{currentUser?.online_status ? 'Active' : 'Away'}</small>
                </Col>
            </Row>
            <h5 className="mb-3">Friends List</h5>
            <ListGroup variant="flush" className="flex-grow-1">
                {users.map((user) => (
                    <ListGroup.Item
                        key={user.id}
                        onClick={() => onUserSelect(user)}
                        className={`d-flex justify-content-between align-items-center ${
                            user.id === selectedUserId ? 'selected-user' : ''
                        }`}
                        action>
                        <Row className="w-100 align-items-center">
                            <Col xs={3}>
                                <Image
                                    src={profilePic}
                                    roundedCircle
                                    fluid
                                />
                            </Col>
                            <Col xs={7}>
                                <h6 className="mb-0">{user.first_name + ' ' + user.last_name}</h6>
                                <small className="text-muted d-flex align-items-center">
                                    <span
                                        className={`me-2 rounded-circle status-circle ${onlineUsers.includes(user.id) ? 'bg-success' : 'bg-danger'}`}>
                                    </span>
                                    {onlineUsers.includes(user.id) ? 'Online' : 'Offline'}
                                </small>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Button variant="danger" className="logout-button" onClick={handleLogout}>
                Logout
            </Button>
        </Container>
    );
}

export default UserList;

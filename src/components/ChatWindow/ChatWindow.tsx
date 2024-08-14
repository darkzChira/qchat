import {useState} from 'react';
import {Container, Row, Col, Form, Button, InputGroup} from 'react-bootstrap';
import {BsEmojiSmile, BsSend, BsArrowRepeat} from 'react-icons/bs';
import {User} from '../../services/api.ts';
import useChat from '../../hooks/useChat.ts';
import profilePic from '../../assets/profile-pic.png';
import './ChatWindow.css'

interface ChatWindowProps {
    selectedUser: User;
    onlineUsersIds: string[];
}

function ChatWindow({selectedUser, onlineUsersIds}: ChatWindowProps) {
    const storedToken = localStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken) : null;
    const userId = token?.user?.id;
    const authToken = token?.token;

    const [message, setMessage] = useState('');
    const {chatHistory, chatEndRef, sendMessageToUser} = useChat(selectedUser, authToken, userId, onlineUsersIds);

    const handleSendMessage = () => {
        if (!selectedUser || !authToken) return;

        const newMessage = {
            sender_id: userId,
            receiver_id: selectedUser.id,
            content: message,
        };

        sendMessageToUser(newMessage);
        setMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Container fluid className="chat-window-container">
            <Row className="h-100 w-auto">
                <Col md={18} className="d-flex flex-column h-100">
                    <div className="settings-tray">
                        <div className="d-flex align-items-center justify-content-between p-2 bg-light">
                            <div className="d-flex align-items-center">
                                <img
                                    className="rounded-circle me-3"
                                    src={profilePic}
                                    alt="User Pic"
                                    width={50}
                                    height={50}
                                />
                                <div>
                                    <h6 className="mb-0">{selectedUser?.first_name + ' ' + selectedUser?.last_name}</h6>
                                    <p className="text-muted mb-0">{selectedUser?.online_status ? 'Active' : 'Away'}</p>
                                </div>
                            </div>
                            <div>
                                <BsArrowRepeat className="me-3"/>
                            </div>
                        </div>
                    </div>
                    <div className="chat-panel flex-grow-1 overflow-auto">
                        {chatHistory.map((msg, index) => (
                            <Row key={index} className="no-gutters">
                                <Col md={msg.sender_id === userId ? {span: 5, offset: 7} : 5}>
                                    <div
                                        className={`chat-bubble chat-bubble--${msg.sender_id === userId ? 'right' : 'left'} p-2`}>
                                        {msg.content}
                                    </div>
                                </Col>
                            </Row>
                        ))}
                        <div ref={chatEndRef}/>
                    </div>
                    <div className="chat-box-tray">
                        <InputGroup className="p-2 bg-light">
                            <InputGroup.Text className="bg-transparent border-0">
                                <BsEmojiSmile/>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Type your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="border-0"
                            />
                            <Button variant="primary" onClick={handleSendMessage}>
                                <BsSend/>
                            </Button>
                        </InputGroup>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ChatWindow;

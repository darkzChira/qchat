import {useState} from 'react';
import {User} from '../../services/api.ts';
import UserList from '../UserList/UserList.tsx';
import ChatWindow from '../ChatWindow/ChatWindow.tsx';
import welcomeImage from '../../assets/welcome.png'
import './ChatPage.css';

function ChatPage() {
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    return (
        <div className="chat-container">
            <div className="user-list-container">
                <UserList
                    onUserSelect={setSelectedUser}
                    selectedUserId={selectedUser?.id}
                    onlineUsers={onlineUsers}
                    setOnlineUsers={setOnlineUsers}
                />
            </div>
            <div className="chat-window-container">
                {selectedUser ? (
                    <ChatWindow
                        selectedUser={selectedUser}
                        onlineUsersIds={onlineUsers}
                    />
                ) : (
                    <div className="welcome-container">
                        <img src={welcomeImage} alt="Welcome" className="welcome-image"/>
                        <h1>Welcome to QChat</h1>
                        <h5 className="text-muted">Easy chat with friends</h5>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPage;
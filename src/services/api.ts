import axios from 'axios';

const API_URL = '/chatapp';

export interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    online_status: boolean;
}

export interface Message {
    sender_id: string;
    receiver_id: string;
    content: string;
    timestamp?: Date;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const registerUser = (userData: Omit<User, 'id' | 'online_status'> & { password: string }) =>
    axios.post(`${API_URL}/api/register`, userData);

export const loginUser = (credentials: { username: string; password: string }) =>
    axios.post<AuthResponse>(`${API_URL}//api/login`, credentials);

export const logoutUser = (token: string, userID: string) =>
    axios.post<Message[]>(`${API_URL}/api/logout/${userID}`, null,{
        headers: { Authorization: `Bearer ${token}` },
    });

export const getUsers = (token: string, userID: string) =>
    axios.get<User[]>(`${API_URL}/api/users/${userID}/others`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const getChatHistory = (token: string, senderID: string, receiverID: string) =>
    axios.get<Message[]>(`${API_URL}/api/chat-history/${senderID}/${receiverID}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const sendMessage = (token: string, message: Message) =>
    axios.post(`${API_URL}/api/send-message`, message, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const getWebSocket = (token: AuthResponse) =>{
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = "goldfish-app-ewgy2.ondigitalocean.app";
    return new WebSocket(`${protocol}//${host}/ws?token=${token.token}`);
}


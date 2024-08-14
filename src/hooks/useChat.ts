import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, User, getChatHistory, sendMessage } from '../services/api.ts';
import useWebSocket from './useWebSocket.ts';

const useChat = (selectedUser: User, authToken: string, userId: string, onlineUsersIds: string[]) => {
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const socket = useWebSocket();
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = useCallback(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        if (!selectedUser || !authToken) return;

        getChatHistory(authToken, userId, selectedUser.id)
            .then((response) => {
                setChatHistory(response.data.reverse());
            })
            .catch(() => {
                alert('Failed to fetch chat history');
            });

        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (
                    data.type === 'message' &&
                    (data.sender_id === selectedUser.id || data.receiver_id === selectedUser.id)
                ) {
                    setChatHistory((prev) => [...prev, data]);
                }
            };
        }

        return () => {
            if (socket) {
                socket.onmessage = null;
            };
        };
    }, [selectedUser, authToken, userId, socket]);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, scrollToBottom]);

    const sendMessageToUser = (message: Message) => {
        const isSelectedUserOnline = selectedUser ? onlineUsersIds.includes(selectedUser.id) : false;

        if (isSelectedUserOnline && socket) {
            socket.send(JSON.stringify({ user_id: userId, type: 'message', ...message }));
        } else if (authToken) {
            sendMessage(authToken, message)
                .then(() => {
                    setChatHistory((prev) => [...prev, message]);
                })
                .catch(() => {
                    alert('Failed to send message');
                });
        }
    };

    return { chatHistory, chatEndRef, sendMessageToUser };
};

export default useChat;

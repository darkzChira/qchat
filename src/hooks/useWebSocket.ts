import { useEffect, useState } from 'react';
import {getWebSocket} from "../services/api.ts";

const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) return;

        const token = JSON.parse(storedToken);

        if (!token) {
            console.error('No valid auth token found for WebSocket connection');
            return;
        }

        const ws = getWebSocket(token)

        ws.onopen = () => {
            console.log('WebSocket connection established'); // debug log
        };
        ws.onclose = (event) => {
            console.log(`WebSocket connection closed: ${event}`); // debug log
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error); // debug log
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return socket;
};

export default useWebSocket;

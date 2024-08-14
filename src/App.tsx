import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import RegisterPage from './components/RegisterPage/RegisterPage.tsx';
import ChatPage from "./components/ChatPage/ChatPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router>
    );
}

export default App;


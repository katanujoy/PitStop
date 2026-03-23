import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import ChatPage from './pages/ChatPage';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PetrolFinder from './pages/PetrolFinder';

// Layout component with Navbar
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <ToastContainer />

          <Routes>
            {/* All routes wrapped with Layout (includes Navbar) */}
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/home" element={<Home />} />
              <Route path="/petrol" element={<PetrolFinder />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
              <Route path="/chat/:requestId" element={<ChatPage />} />
            </Route>

            {/* Redirect root to /home */}
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

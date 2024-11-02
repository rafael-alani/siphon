import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LandingLayout from './layouts/LandingLayout';
import About from './pages/About';
import Contact from './pages/Contact';
import Analytics from './pages/dashboard/Analytics';
import Ledger from './pages/dashboard/Ledger';
import Participants from './pages/dashboard/Participants';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Solutions from './pages/Solutions';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Landing />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="contact" element={<Contact />} />
            <Route path="solutions" element={<Solutions />} />
          </Route>
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard/ledger" replace />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="participants" element={<Participants />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          
          <Route path="/demo" element={<DashboardLayout/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
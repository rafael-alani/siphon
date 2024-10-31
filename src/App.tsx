import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import About from './pages/About';
import Login from './pages/Login';
import Ledger from './pages/dashboard/Ledger';
import Participants from './pages/dashboard/Participants';
import Analytics from './pages/dashboard/Analytics';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
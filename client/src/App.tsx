import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DealDashboard } from './pages/DealDashboard';
import { DealDetail } from './pages/DealDetail';
import { Memory } from './pages/Memory';
import { Settings } from './pages/Settings';

import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/layout/AuthGuard';
import { Landing } from './pages/auth/Landing';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Onboarding } from './pages/auth/Onboarding';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route element={<AuthGuard />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/deals" replace />} />
              <Route path="deals" element={<DealDashboard />} />
              <Route path="deals/:dealId" element={<DealDetail />} />
              <Route path="memory" element={<Memory />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

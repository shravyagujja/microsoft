import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BrainCircuit } from 'lucide-react';

export const AuthGuard = () => {
  const { user, isDemoMode, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 text-indigo-600">
          <BrainCircuit className="w-12 h-12 animate-pulse" />
          <div className="text-sm font-medium text-gray-500 animate-pulse">Loading Deal Pulse AI...</div>
        </div>
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return <Navigate to="/landing" replace />;
  }

  return <Outlet />;
};

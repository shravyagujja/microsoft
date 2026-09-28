import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, BrainCircuit, Settings, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

export const Layout = () => {
  const { user, company, isDemoMode, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Deals', path: '/deals', icon: Briefcase },
    { name: 'Memory', path: '/memory', icon: BrainCircuit },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col border-r border-gray-800 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="relative flex items-center justify-center">
            <Activity className="w-6 h-6 text-indigo-500" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">Deal Pulse AI</h1>
            <p className="text-xs text-gray-500">{isDemoMode ? 'Demo Workspace' : company?.name || 'Workspace'}</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-800/50 hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {isDemoMode ? 'D' : user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{isDemoMode ? 'Demo User' : user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{isDemoMode ? 'demo@dealpulse.ai' : user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

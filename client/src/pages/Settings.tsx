import { useState } from 'react';
import { seedDemo } from '../api/deals';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save } from 'lucide-react';

export const Settings = () => {
  const { user, company, isDemoMode, logout } = useAuth();
  const navigate = useNavigate();
  
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');
  const [saved, setSaved] = useState(false);

  // Forms state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(company?.name || '');
  const [preferences, setPreferences] = useState({ notifications: true, weeklyReport: true });

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult('');
    try {
      await seedDemo();
      setSeedResult('Demo seeded successfully!');
    } catch (e: any) {
      setSeedResult(`Failed to seed demo: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="space-y-6">
        {/* User Profile */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} disabled={isDemoMode} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={isDemoMode} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50" />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} disabled={isDemoMode} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50" />
            </div>
            <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50 mt-4">
              <span className="font-medium text-gray-700">CRM Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Connected</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={preferences.notifications} onChange={e => setPreferences({...preferences, notifications: e.target.checked})} disabled={isDemoMode} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Receive deal risk alerts via email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={preferences.weeklyReport} onChange={e => setPreferences({...preferences, weeklyReport: e.target.checked})} disabled={isDemoMode} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Receive weekly pipeline summary</span>
            </label>
          </div>
        </div>

        {/* Save/Cancel Actions */}
        <div className="flex items-center gap-4 py-4">
          <button 
            onClick={handleSave} 
            disabled={isDemoMode}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
          <button 
            onClick={() => { setName(user?.name || ''); setEmail(user?.email || ''); setCompanyName(company?.name || ''); }} 
            disabled={isDemoMode}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          {saved && <span className="text-sm font-medium text-green-600">Settings saved successfully!</span>}
        </div>

        {/* Developer / Demo Tools */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Developer Tools</h2>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
            <p className="text-sm text-gray-600">Populate the database with the synthetic 12 demo deals.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSeed}
                disabled={seeding}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
              >
                {seeding ? 'Seeding...' : 'Seed Demo Data'}
              </button>
              {seedResult && <span className="text-sm font-medium text-green-600">{seedResult}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

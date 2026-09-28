import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BrainCircuit } from 'lucide-react';
import { apiClient } from '../../api/client';

export const Onboarding = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setCompany } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName || !industry || !size || !role) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post<any>('/auth/onboard', { 
        userId: user?.id, 
        companyName, 
        industry, 
        size, 
        role 
      });
      if (res.data?.success) {
        setCompany(res.data.data.company);
        navigate('/');
      } else {
        setError(res.data?.error?.message || 'Onboarding failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'An error occurred during onboarding.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 text-indigo-600 mb-6">
          <BrainCircuit className="w-10 h-10" />
          <span className="text-3xl font-bold text-gray-900 tracking-tight">Deal Pulse<span className="text-indigo-600">AI</span></span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome, {user.name}!</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's set up your workspace. Tell us about your company.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <div className="mt-1">
                <input type="text" placeholder="e.g. Acme Technologies" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <div className="mt-1">
                <select required value={industry} onChange={e => setIndustry(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Select industry</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company Size</label>
              <div className="mt-1">
                <select required value={size} onChange={e => setSize(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">User Role</label>
              <div className="mt-1">
                <input type="text" placeholder="e.g. Sales Manager" required value={role} onChange={e => setRole(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {loading ? 'Saving...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

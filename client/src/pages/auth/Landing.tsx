import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BrainCircuit, Activity, BarChart3, Clock, ArrowRight } from 'lucide-react';

export const Landing = () => {
  const { setDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleDemo = () => {
    setDemoMode(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-indigo-600">
          <BrainCircuit className="w-8 h-8" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Deal Pulse<span className="text-indigo-600">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto w-full">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
          Memory-driven deal intelligence
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          Stop losing context.<br />
          <span className="text-indigo-600">Start winning deals.</span>
        </h1>
        
        <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          Not just remembering conversations — understanding how the deal evolved.
          Deal Pulse AI remembers requirements, detects priority shifts, and highlights risks before they derail your deal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/signup" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <button onClick={handleDemo} className="flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
            Explore Demo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Retain & Recall</h3>
            <p className="text-gray-500">Automatically capture commitments, requirements, and objections across all your meetings.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reflect & Evolve</h3>
            <p className="text-gray-500">Understand exactly how a customer's priorities have shifted from week 1 to week 10.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Identify Risks</h3>
            <p className="text-gray-500">Get evidence-backed alerts when promised commitments or critical requirements remain unresolved.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

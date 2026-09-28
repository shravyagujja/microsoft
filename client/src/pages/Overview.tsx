import { Link } from 'react-router-dom';

export const Overview = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Overview</h1>
      <p className="text-gray-500 mb-6">Welcome to Deal Pulse AI.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Deals</h3>
          <p className="text-3xl font-semibold">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">At Risk</h3>
          <p className="text-3xl font-semibold text-red-600">4</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Open Commitments</h3>
          <p className="text-3xl font-semibold text-amber-600">7</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Priority Shifts</h3>
          <p className="text-3xl font-semibold text-indigo-600">9</p>
        </div>
      </div>
      
      <div className="mt-8">
        <Link to="/deals" className="text-indigo-600 font-medium hover:underline">
          View all deals &rarr;
        </Link>
      </div>
    </div>
  );
};

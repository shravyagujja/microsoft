import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Plus } from 'lucide-react';
import { useDeals } from '../hooks/useDeals';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';
import { NewInteractionModal } from '../components/timeline/NewInteractionModal';

export const DealDashboard = () => {
  const { deals, loading } = useDeals();
  const { company, isDemoMode } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMetricFilter, setActiveMetricFilter] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) setShowFilters(false);
      if (sortRef.current && !sortRef.current.contains(target)) setShowSort(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseFilteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesSearch = 
        deal.customerName.toLowerCase().includes(search.toLowerCase()) ||
        deal.currentConcern?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStage = filterStage ? deal.stage.toLowerCase() === filterStage.toLowerCase() : true;
      const matchesRisk = filterRisk ? deal.riskLevel === filterRisk : true;

      return matchesSearch && matchesStage && matchesRisk;
    });
  }, [deals, search, filterStage, filterRisk]);

  const atRiskCount = baseFilteredDeals.filter((d: any) => d.riskLevel === 'high').length;
  // Use actual counts by filtering deals that have them
  const openCommitmentsCount = baseFilteredDeals.filter((d: any) => (d.commitments?.length || 0) > 0).length;
  const priorityShiftsCount = baseFilteredDeals.filter((d: any) => (d.priorityShifts?.length || 0) > 0).length;

  const displayedDeals = useMemo(() => {
    let result = [...baseFilteredDeals];
    
    if (activeMetricFilter === 'at_risk') {
      result = result.filter(d => d.riskLevel === 'high');
    } else if (activeMetricFilter === 'open_commitments') {
      result = result.filter((d: any) => (d.commitments?.length || 0) > 0);
    } else if (activeMetricFilter === 'priority_shifts') {
      result = result.filter((d: any) => (d.priorityShifts?.length || 0) > 0);
    }

    // Sort
    return result.sort((a: any, b: any) => {
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'days') return b.daysActive - a.daysActive;
      if (sortBy === 'risk') {
        const riskWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
        return (riskWeight[b.riskLevel] || 0) - (riskWeight[a.riskLevel] || 0);
      }
      return new Date(b.lastInteractionAt || 0).getTime() - new Date(a.lastInteractionAt || 0).getTime();
    });
  }, [baseFilteredDeals, activeMetricFilter, sortBy]);

  return (
    <div className="p-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 truncate">
            {isDemoMode ? 'Demo Workspace' : company?.name ? `${company.name} Workspace` : 'Deal Pulse'}
          </h1>
          <p className="text-gray-500 truncate">See what changed, what matters now, and what needs attention.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search deals, customers, or concerns…" 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 font-medium text-sm transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4 shrink-0" /> Filter
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Filter Deals</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Stage</label>
                    <select 
                      value={filterStage} 
                      onChange={e => setFilterStage(e.target.value)}
                      className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Stages</option>
                      <option value="discovery">Discovery</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed won">Closed Won</option>
                      <option value="closed lost">Closed Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Risk Level</label>
                    <select 
                      value={filterRisk} 
                      onChange={e => setFilterRisk(e.target.value)}
                      className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Risks</option>
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => { setFilterStage(''); setFilterRisk(''); setShowFilters(false); }}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium bg-gray-50 rounded-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setShowSort(!showSort)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 font-medium text-sm transition-colors whitespace-nowrap"
            >
              <ArrowUpDown className="w-4 h-4 shrink-0" /> Sort
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-2">
                <button onClick={() => { setSortBy('updated'); setShowSort(false); }} className={cn("block w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50", sortBy === 'updated' && 'bg-indigo-50 text-indigo-700 font-medium')}>Recently Updated</button>
                <button onClick={() => { setSortBy('risk'); setShowSort(false); }} className={cn("block w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50", sortBy === 'risk' && 'bg-indigo-50 text-indigo-700 font-medium')}>Risk: High to Low</button>
                <button onClick={() => { setSortBy('value'); setShowSort(false); }} className={cn("block w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50", sortBy === 'value' && 'bg-indigo-50 text-indigo-700 font-medium')}>Value: High to Low</button>
                <button onClick={() => { setSortBy('days'); setShowSort(false); }} className={cn("block w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50", sortBy === 'days' && 'bg-indigo-50 text-indigo-700 font-medium')}>Days Active: High to Low</button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 font-medium text-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" /> New Interaction
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button 
          onClick={() => setActiveMetricFilter(activeMetricFilter === null ? null : null)}
          className={cn("text-left p-6 rounded-xl border shadow-sm min-w-0 transition-all hover:shadow-md cursor-pointer", 
            activeMetricFilter === null ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500" : "bg-white border-gray-200"
          )}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1 truncate">Active Deals</h3>
          <p className="text-3xl font-semibold">{baseFilteredDeals.length}</p>
        </button>
        <button 
          onClick={() => setActiveMetricFilter(activeMetricFilter === 'at_risk' ? null : 'at_risk')}
          className={cn("text-left p-6 rounded-xl border shadow-sm min-w-0 transition-all hover:shadow-md cursor-pointer",
            activeMetricFilter === 'at_risk' ? "bg-red-50 border-red-200 ring-1 ring-red-500" : "bg-white border-gray-200"
          )}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1 truncate">At Risk</h3>
          <p className="text-3xl font-semibold text-red-600">{atRiskCount}</p>
        </button>
        <button 
          onClick={() => setActiveMetricFilter(activeMetricFilter === 'open_commitments' ? null : 'open_commitments')}
          className={cn("text-left p-6 rounded-xl border shadow-sm min-w-0 transition-all hover:shadow-md cursor-pointer",
            activeMetricFilter === 'open_commitments' ? "bg-amber-50 border-amber-200 ring-1 ring-amber-500" : "bg-white border-gray-200"
          )}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1 truncate">Open Commitments</h3>
          <p className="text-3xl font-semibold text-amber-600">{openCommitmentsCount}</p>
        </button>
        <button 
          onClick={() => setActiveMetricFilter(activeMetricFilter === 'priority_shifts' ? null : 'priority_shifts')}
          className={cn("text-left p-6 rounded-xl border shadow-sm min-w-0 transition-all hover:shadow-md cursor-pointer",
            activeMetricFilter === 'priority_shifts' ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500" : "bg-white border-gray-200"
          )}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1 truncate">Priority Shifts</h3>
          <p className="text-3xl font-semibold text-indigo-600">{priorityShiftsCount}</p>
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading deals...</div>
      ) : displayedDeals.length === 0 ? (
        <div className="text-gray-500">No deals match your search criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDeals.map((deal: any) => (
            <Link key={deal.id} to={`/deals/${deal.id}`} className="block group">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm group-hover:shadow-md transition-shadow h-full flex flex-col relative">
                <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-purple-200 z-10 whitespace-nowrap">
                  Demo / Synthetic Data
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{deal.customerName}</h3>
                    <p className="text-gray-500 text-sm font-medium">${deal.value.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1 items-end h-8">
                    {(deal.riskTrend || [1, 2, 3, 2, 4]).map((v: number, i: number) => (
                      <div 
                        key={i} 
                        className={cn("w-1.5 rounded-t-sm", deal.riskLevel === 'high' ? 'bg-red-200' : 'bg-indigo-100')} 
                        style={{ height: `${(v / 5) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 flex-1">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium capitalize">{deal.stage}</span>
                  <span>{deal.daysActive} days active</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      deal.riskLevel === 'high' ? 'bg-red-500' :
                      deal.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                    )} />
                    <span className={cn(
                      "font-semibold text-sm",
                      deal.riskLevel === 'high' ? 'text-red-700' :
                      deal.riskLevel === 'medium' ? 'text-amber-700' : 'text-green-700'
                    )}>
                      {deal.riskLevel === 'high' ? 'High Risk' : deal.riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk'}
                    </span>
                  </div>
                  {deal.currentConcern && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">Current concern: <span className="font-medium text-gray-900">{deal.currentConcern}</span></p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <NewInteractionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onComplete={() => window.location.reload()} 
      />
    </div>
  );
};

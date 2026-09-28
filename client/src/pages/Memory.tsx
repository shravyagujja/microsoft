import { useState, useEffect } from 'react';
import { Search, Eye, EyeOff, Shuffle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Memory as MemoryType } from '../types';
import { DEMO_MEMORIES } from '../data/demoData';
import { cn } from '../utils/cn';
import { fetchMemories } from '../api/deals';
import { useDeals } from '../hooks/useDeals';
import { useAnalysis } from '../hooks/useAnalysis';
import { BrainCircuit, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';

export const Memory = () => {
  const [memories, setMemories] = useState<MemoryType[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDealId, setSelectedDealId] = useState('');
  const { deals } = useDeals();
  const { analysis } = useAnalysis(selectedDealId);
  const [showEvidence, setShowEvidence] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMemories = async () => {
      if (!selectedDealId) {
        setMemories([]);
        return;
      }
      const { data } = await fetchMemories(selectedDealId);
      if (data) {
        setMemories(data);
      } else {
        setMemories(DEMO_MEMORIES);
      }
    };
    loadMemories();
  }, [selectedDealId]);

  const categories = ['All', 'Requirements', 'Objections', 'Commitments', 'Stakeholders', 'Priority Changes', 'Outcomes'];

  const filteredMemories = memories.filter(m => {
    const matchesFilter = filter === 'All' || m.category.toLowerCase().replace('_', ' ') === filter.toLowerCase();
    const matchesSearch = m.summary.toLowerCase().includes(search.toLowerCase()) || 
                          m.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal Memory</h1>
          <p className="text-gray-500">Persistent memory powering the Deal Pulse AI.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedDealId}
            onChange={e => setSelectedDealId(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
          >
            <option value="">-- Select a Deal --</option>
            {deals.map(d => (
              <option key={d.id} value={d.id}>{d.customerName}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-gray-600">
              Memory connected
            </span>
          </div>
        </div>
      </header>

      <div className="mb-6 flex gap-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search deal memory..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                filter === cat 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {!selectedDealId ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg font-medium">
            Select a deal to explore its memory.
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg font-medium">
            No memories found.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* DEMO FEATURE: BEFORE/AFTER HINDSIGHT */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm shrink-0 mt-2">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">See The Memory Difference</h2>
                <p className="text-gray-500 font-medium">Same conversation. Different understanding.</p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowEvidence(!showEvidence)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
                  >
                    {showEvidence ? <><EyeOff className="w-4 h-4" /> Hide Evidence</> : <><Eye className="w-4 h-4" /> View Memory Evidence</>}
                  </button>
                  <button 
                    onClick={() => {
                      const otherDeals = deals.filter(d => d.id !== selectedDealId);
                      if (otherDeals.length > 0) {
                        setSelectedDealId(otherDeals[Math.floor(Math.random() * otherDeals.length)].id);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
                  >
                    <Shuffle className="w-4 h-4" /> Try Another Deal
                  </button>
                </div>
                <button 
                  onClick={() => navigate(`/deals/${selectedDealId}`)}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                >
                  Open Deal <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
                
                <div className="pr-4 flex flex-col gap-6">
                  <div>
                    <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-1">Without Hindsight</h3>
                    <p className="text-sm font-semibold text-gray-500 mb-4">Current interaction only</p>
                    
                    <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-gray-600 italic text-[15px] leading-relaxed shadow-inner">
                      "Can you actually guarantee the 30-day deployment?"
                    </div>
                    
                    <div className="mt-4 bg-gray-100 border border-gray-200 p-4 rounded-xl text-gray-600 text-sm font-medium">
                      The customer is asking about deployment.
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm"><span className="text-gray-400 font-medium">Context</span><span className="font-semibold text-gray-700">Current message only</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-gray-400 font-medium">Scope</span><span className="font-semibold text-gray-700">One interaction</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-gray-400 font-medium">Evolution</span><span className="font-semibold text-gray-700">No evolution</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-gray-400 font-medium">Commitments</span><span className="font-semibold text-gray-700">No previous commitment</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-gray-400 font-medium">Understanding</span><span className="font-semibold text-gray-700">Generic understanding</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-gray-400 font-medium">Risk Analysis</span><span className="font-semibold text-gray-700">Limited risk context</span></div>
                  </div>
                </div>

                <div className="pl-4 flex flex-col gap-6">
                  <div>
                    <h3 className="text-lg font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" /> With Hindsight
                    </h3>
                    <p className="text-sm font-semibold text-indigo-400 mb-4">Historical context recalled</p>
                    
                    <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl text-indigo-900 italic text-[15px] leading-relaxed shadow-inner">
                      "Can you actually guarantee the 30-day deployment?"
                    </div>

                    <div className="mt-4 bg-indigo-600 border border-indigo-700 p-4 rounded-xl text-white text-sm font-medium shadow-md">
                      Deployment became the customer's primary concern after Week 2. A previous deployment commitment remains unresolved.
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm"><span className="text-indigo-400 font-medium">Context</span><span className="font-bold text-indigo-900">Historical deal context</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-indigo-400 font-medium">Scope</span><span className="font-bold text-indigo-900">Multiple interactions connected</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-indigo-400 font-medium">Evolution</span><span className="font-bold text-indigo-900">Priority evolution</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-indigo-400 font-medium">Commitments</span><span className="font-bold text-indigo-900">Previous commitment recalled</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-indigo-400 font-medium">Understanding</span><span className="font-bold text-indigo-900">Context-aware understanding</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-indigo-400 font-medium">Risk Analysis</span><span className="font-bold text-indigo-900">Current unresolved risk</span></div>
                  </div>
                </div>
              </div>

              {showEvidence && (
                <div className="mt-8 pt-6 border-t border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">How the deal evolved</h4>
                  <div className="space-y-4">
                    {memories.length > 0 ? (
                      memories.slice(0, 5).map((m, i) => (
                        <div key={i} className="bg-white border border-gray-200 p-4 rounded-xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-bold text-gray-400 uppercase">{new Date(m.timestamp).toLocaleDateString()}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600">
                                {m.category.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 mb-1">{m.summary}</p>
                            <ul className="space-y-1">
                              {m.evidence.map((ev, evIdx) => (
                                <li key={evIdx} className="text-xs text-gray-500 italic flex gap-2">
                                  <span className="text-indigo-400">•</span> "{ev}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center text-gray-500 italic font-medium">
                        Limited historical context available for this deal.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {analysis && (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm shrink-0">
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <BrainCircuit className="w-8 h-8 text-indigo-600" />
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Hindsight Memory Flow</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
                  <div className="absolute top-1/2 left-[16.66%] right-[16.66%] h-0.5 bg-gray-200 -z-10 hidden md:block"></div>
                  
                  <div className="bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-md flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm text-indigo-600 font-black text-xl">1</div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Retain</h4>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-2">What happened?</span>
                    <p className="text-xs font-medium text-gray-500 mb-2">Requirements / Objections / Commitments<br/>Stakeholders / Outcomes / Interactions</p>
                    <p className="text-sm font-bold text-indigo-900 mt-2">
                      {memories.length > 0 
                        ? `Available: ${memories.length} historical records`
                        : "Unavailable: No interactions retained yet"}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-md flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm text-indigo-600 font-black text-xl">2</div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Recall</h4>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-2">What matters from the past?</span>
                    <p className="text-xs font-medium text-gray-500 mb-2">Previous requirements / repeated concerns<br/>Previous commitments / priority changes</p>
                    <p className="text-sm font-bold text-indigo-900 mt-2">
                      {analysis.evidence?.length > 0
                        ? `Available: Retrieved ${analysis.evidence.length} context pieces`
                        : "Unavailable: No context matched"}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-md flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm text-indigo-600 font-black text-xl">3</div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Reflect</h4>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-2">What changed?</span>
                    <p className="text-xs font-medium text-gray-500 mb-2">Priority evolution<br/>Unresolved commitments<br/>Current deal risk</p>
                    <p className="text-sm font-bold text-indigo-900 mt-2">
                      {analysis.reasoningSummary ? "Available: Analyzed deal evolution" : "Unavailable: Not enough data"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3 bg-red-50 border border-red-200 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={cn("w-6 h-6", 
                        analysis.currentRisk?.level === 'high' ? 'text-red-600' :
                        analysis.currentRisk?.level === 'medium' ? 'text-amber-600' : 'text-green-600'
                      )} />
                      <h4 className="text-sm font-black text-red-900 uppercase tracking-widest">Current Deal Risk</h4>
                    </div>
                    <p className="text-[15px] font-bold text-red-950 leading-relaxed">{analysis.currentRisk?.description || "No detected risks."}</p>
                  </div>
                  <div className="flex flex-col gap-3 bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-6 h-6 text-emerald-600" />
                      <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Recommended Action</h4>
                    </div>
                    <p className="text-[15px] font-bold text-emerald-950 leading-relaxed">{analysis.recommendedNextAction?.action || "No action recommended."}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm shrink-0 mb-8 flex flex-col md:flex-row gap-8 items-center justify-between">
               <div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">The Learning Curve</h3>
                 <p className="text-gray-500 text-sm font-medium">REMEMBER &rarr; COMPARE &rarr; LEARN &rarr; ADAPT</p>
               </div>
               <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2">
                 <div className="flex flex-col gap-1 min-w-[140px]">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Interaction 1</span>
                   <div className="h-2 w-full bg-indigo-100 rounded-full"><div className="h-full bg-indigo-300 rounded-full w-1/4"></div></div>
                   <span className="text-xs font-bold text-gray-700">Generic understanding</span>
                 </div>
                 <div className="flex flex-col gap-1 min-w-[140px]">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Interaction 5</span>
                   <div className="h-2 w-full bg-indigo-100 rounded-full"><div className="h-full bg-indigo-400 rounded-full w-1/2"></div></div>
                   <span className="text-xs font-bold text-gray-700">Personalized understanding</span>
                 </div>
                 <div className="flex flex-col gap-1 min-w-[140px]">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Interaction 20</span>
                   <div className="h-2 w-full bg-indigo-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full w-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div></div>
                   <span className="text-xs font-bold text-indigo-700">Deep historical understanding</span>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map(memory => (
              <div key={memory.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col relative">
                <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-purple-200 z-10 whitespace-nowrap">
                  Retained Context
                </div>
                <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                  {memory.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400 font-medium">{new Date(memory.timestamp).toLocaleDateString()}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-4 flex-1">{memory.summary}</h3>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Evidence</p>
                <ul className="space-y-1">
                  {memory.evidence.map((ev, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-indigo-400 font-bold">•</span> {ev}
                    </li>
                  ))}
                </ul>
              </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

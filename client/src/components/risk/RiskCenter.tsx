import { useState } from 'react';
import type { DealAnalysis } from '../../types';
import { cn } from '../../utils/cn';
import { ShieldAlert, History, Users, GitCommit, ArrowRight, BrainCircuit } from 'lucide-react';
import { DEMO_COMMITMENTS, DEMO_STAKEHOLDERS } from '../../data/demoData';

export const RiskCenter = ({ deal, analysis }: { deal: any, analysis: DealAnalysis }) => {
  const [showDiff, setShowDiff] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      
      {/* Hero: Current Risk */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300">
        <div className={cn("p-6 border-b shrink-0", 
          analysis.currentRisk.level === 'high' ? 'bg-red-50 border-red-100' : 
          analysis.currentRisk.level === 'medium' ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'
        )}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className={cn("w-6 h-6 shrink-0", 
              analysis.currentRisk.level === 'high' ? 'text-red-600' : 
              analysis.currentRisk.level === 'medium' ? 'text-amber-600' : 'text-green-600'
            )} />
            <h2 className={cn("text-xl font-bold truncate", 
              analysis.currentRisk.level === 'high' ? 'text-red-900' : 
              analysis.currentRisk.level === 'medium' ? 'text-amber-900' : 'text-green-900'
            )}>CURRENT DEAL RISK</h2>
          </div>
          <p className={cn("font-medium text-lg", 
             analysis.currentRisk.level === 'high' ? 'text-red-800' : 
             analysis.currentRisk.level === 'medium' ? 'text-amber-800' : 'text-green-800'
          )}>
            {analysis.currentRisk.description}
          </p>
        </div>
        <div className="p-6 bg-white shrink-0">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {analysis.reasoningSummary}
          </p>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <button 
              onClick={() => { setShowDiff(!showDiff); setShowReasoning(false); }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <BrainCircuit className="w-4 h-4 shrink-0" /> {showDiff ? 'Hide' : 'Show'} Memory Difference
            </button>
            <button 
              onClick={() => { setShowReasoning(!showReasoning); setShowDiff(false); }}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              {showReasoning ? 'Hide' : 'Show'} reasoning
            </button>
          </div>

          {/* Reasoning Panel */}
          {showReasoning && (
            <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Analysis Reasoning</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 font-medium block">Memory used</span>
                  <span className="text-gray-900 font-semibold">12 relevant interactions</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Key Requirements</span>
                  <span className="text-gray-900 font-semibold">30-day deployment, SSO</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Detected Objections</span>
                  <span className="text-gray-900 font-semibold">Deployment guarantee questioned</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Unresolved Commitments</span>
                  <span className="text-gray-900 font-semibold">Deployment plan promised</span>
                </div>
              </div>
            </div>
          )}

          {/* Memory Difference Panel */}
          {showDiff && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gray-300" />
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Without Hindsight</h4>
                <p className="text-gray-600 italic">"The customer seems concerned about deployment."</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl shadow-sm relative overflow-hidden ring-1 ring-indigo-500/20">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-1"><BrainCircuit className="w-3 h-3" /> With Hindsight</h4>
                <p className="text-indigo-900 font-medium">"Deployment has become the dominant concern over the last three weeks, and a previously promised deployment commitment remains unresolved."</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Priority Evolution */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Priority Evolution</h3>
        <p className="text-sm text-gray-500 mb-4">How the deal's center of gravity changed.</p>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6">
          {analysis.priorityEvolution.map((evol, i) => (
            <div key={i} className="flex items-center gap-6 w-full">
              <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-100 text-center relative opacity-50">
                <span className="font-semibold text-gray-500">{evol.from}</span>
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-400 shrink-0" />
              <div className="flex-1 bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-center ring-2 ring-indigo-500/20">
                <span className="font-bold text-indigo-700">{evol.to}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Evidence */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Why we believe this:</h3>
        <div className="space-y-3">
          {analysis.evidence.map((ev, i) => (
            <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors">
              <div className="bg-green-100 text-green-700 rounded-full p-1 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="text-gray-900 font-medium">{ev.description}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{ev.memoryType} • {new Date(ev.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commitments */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GitCommit className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Commitments Tracker</h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Commitment</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(deal.commitments?.length ? deal.commitments : DEMO_COMMITMENTS).map((c: any) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.description || c.action}</td>
                  <td className="px-4 py-3 text-gray-600">{c.owner}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(c.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold capitalize",
                      c.status === 'promised' ? 'bg-amber-100 text-amber-700' :
                      c.status === 'completed' ? 'bg-green-100 text-green-700' :
                      c.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    )}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stakeholders */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Stakeholder Intelligence</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(deal.stakeholders?.length ? deal.stakeholders : DEMO_STAKEHOLDERS).map((s: any) => (
            <div key={s.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 text-lg">{s.name}</h4>
              <p className="text-sm text-indigo-600 font-medium mb-3">{s.role}</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-semibold">Concerns</p>
                <div className="flex flex-wrap gap-2">
                  {(s.concerns || []).map((c: string) => (
                    <span key={c} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Historical Learning */}
      {analysis.historicalLearning && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">What We've Learned From Similar Deals</h3>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">HISTORICAL PATTERN</span>
              <span className="text-sm text-slate-400">{analysis.historicalLearning.similarCasesCount} similar cases</span>
            </div>
            <h4 className="text-lg font-medium text-white mb-4">Pattern: {analysis.historicalLearning.pattern}</h4>
            <div className="space-y-3 mb-6">
              {analysis.historicalLearning.outcomes.map((o, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-slate-400 text-sm">{o.count}</div>
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={cn("h-full", i === 0 ? "bg-green-500" : "bg-red-500")} style={{ width: `${(o.count / analysis.historicalLearning!.similarCasesCount) * 100}%` }}></div>
                  </div>
                  <div className="text-sm text-slate-300 w-1/2">{o.description}</div>
                </div>
              ))}
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-300 font-medium mb-1">Suggested approach:</p>
              <p className="text-indigo-200">{analysis.historicalLearning.suggestedApproach}</p>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Next Action */}
      <section className="pb-12">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Next Action</h3>
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
          <p className="text-lg font-semibold text-indigo-900 mb-2">{analysis.recommendedNextAction.action}</p>
          <p className="text-indigo-700/80 text-sm mb-4">{analysis.recommendedNextAction.reasoning}</p>
          <button className="text-sm font-semibold bg-white text-indigo-700 px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
            View Evidence
          </button>
        </div>
      </section>

    </div>
  );
};

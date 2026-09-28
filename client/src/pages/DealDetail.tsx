import { useParams } from 'react-router-dom';
import { useDeal } from '../hooks/useDeal';
import { useAnalysis } from '../hooks/useAnalysis';
import { cn } from '../utils/cn';
import { Timeline } from '../components/timeline/Timeline';
import { RiskCenter } from '../components/risk/RiskCenter';
import { Composer } from '../components/composer/Composer';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { NewInteractionModal } from '../components/timeline/NewInteractionModal';

export const DealDetail = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const { deal, loading: dealLoading } = useDeal(dealId || '');
  const { analysis, loading: analysisLoading } = useAnalysis(dealId || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (dealLoading || analysisLoading) {
    return <div className="p-8 text-gray-500">Loading deal context...</div>;
  }

  if (!deal || !analysis) {
    return <div className="p-8 text-red-500">Failed to load deal.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="px-8 py-5 border-b border-gray-200 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="min-w-0 w-full relative">
          <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-purple-200 z-10 whitespace-nowrap hidden md:block">
            Demo / Synthetic Data
          </div>
          <h1 className="text-2xl font-bold text-gray-900 truncate pr-32">{deal.customerName}</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm mt-1 text-gray-500 font-medium">
            <span>${deal.value.toLocaleString()}</span>
            <span className="capitalize">{deal.stage}</span>
            <span>{deal.daysActive} days active</span>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "w-2 h-2 rounded-full shrink-0",
                deal.riskLevel === 'high' ? 'bg-red-500' :
                deal.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-green-500'
              )} />
              <span className={cn(
                "whitespace-nowrap",
                deal.riskLevel === 'high' ? 'text-red-700' :
                deal.riskLevel === 'medium' ? 'text-amber-700' : 'text-green-700'
              )}>
                {deal.riskLevel === 'high' ? 'At Risk' : deal.riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk'}
              </span>
            </div>
            <span className="whitespace-nowrap">Last interaction: Today, 4:32 PM</span>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 font-medium text-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Interaction
        </button>
      </header>

      {/* 3-Panel Layout */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
        {/* Left Panel: Timeline */}
        <div className="w-full lg:w-1/4 lg:min-w-[280px] border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 overflow-y-auto shrink-0">
          <Timeline dealId={deal.id} />
        </div>
        
        <div className="flex-1 min-w-0 overflow-y-auto bg-white border-b lg:border-b-0">
          <RiskCenter deal={deal} analysis={analysis} />
        </div>

        {/* Right Panel: AI Composer */}
        <div className="w-full lg:w-1/3 lg:min-w-[320px] lg:border-l border-gray-200 bg-gray-50 overflow-y-auto shrink-0">
          <Composer dealId={deal.id} deal={deal} />
        </div>
      </div>

      <NewInteractionModal 
        dealId={deal.id}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onComplete={() => window.location.reload()} 
      />
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Video, FileText, X, CheckCircle2, Loader2, BrainCircuit } from 'lucide-react';
import { cn } from '../../utils/cn';
import { addInteraction, analyzeDeal } from '../../api/deals';
import { useDeals } from '../../hooks/useDeals';

const INTERACTION_TYPES = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'meeting', label: 'Meeting', icon: Video },
  { id: 'call', label: 'Call', icon: Phone },
  { id: 'note', label: 'Note', icon: FileText },
];

const PROCESSING_STEPS = [
  'Reading interaction...',
  'Extracting requirements...',
  'Detecting objections...',
  'Identifying stakeholders...',
  'Detecting commitments...',
  'Checking priority shifts...',
  'Updating long-term memory...',
  'Re-evaluating deal risk...'
];

export const NewInteractionModal = ({ 
  dealId,
  isOpen, 
  onClose,
  onComplete
}: { 
  dealId?: string;
  isOpen: boolean; 
  onClose: () => void;
  onComplete: () => void;
}) => {
  const [type, setType] = useState('email');
  const [content, setContent] = useState('');
  const [selectedDealId, setSelectedDealId] = useState(dealId || '');
  const { deals } = useDeals();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [apiError, setApiError] = useState('');
  const apiCompleteRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setType('email');
      setContent('');
      setSelectedDealId(dealId || '');
      setIsProcessing(false);
      setCurrentStep(0);
      setApiError('');
      apiCompleteRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isProcessing && currentStep < PROCESSING_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (isProcessing && currentStep === PROCESSING_STEPS.length - 1) {
      if (apiCompleteRef.current) {
        const timer = setTimeout(() => {
          setIsProcessing(false);
          onComplete();
          onClose();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isProcessing, currentStep, onComplete, onClose]);

  const handleProcess = async () => {
    setIsProcessing(true);
    setApiError('');
    apiCompleteRef.current = false;
    const targetDealId = dealId || selectedDealId;
    if (!targetDealId) {
      setApiError('Please select a deal.');
      setIsProcessing(false);
      return;
    }
    try {
      await addInteraction(targetDealId, { type, content, source: type });
      await analyzeDeal(targetDealId);
      apiCompleteRef.current = true;
    } catch (e: any) {
      setApiError(e.message || 'Failed to process interaction.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Log New Interaction</h2>
          <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isProcessing ? (
          <div className="p-10 flex flex-col items-center justify-center bg-gray-50 flex-1">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <BrainCircuit className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-8">Deal Pulse AI Processing</h3>
            
            <div className="w-full max-w-md space-y-4">
              {PROCESSING_STEPS.map((step, index) => {
                const isActive = index === currentStep;
                const isDone = index < currentStep;
                const isPending = index > currentStep;

                return (
                  <div key={step} className={cn(
                    "flex items-center gap-3 transition-all duration-300",
                    isPending ? "opacity-30" : "opacity-100"
                  )}>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      isActive ? "text-indigo-700" : isDone ? "text-gray-600" : "text-gray-400"
                    )}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1">
            {!dealId && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Deal</label>
                <select 
                  value={selectedDealId}
                  onChange={e => setSelectedDealId(e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                >
                  <option value="">-- Choose a deal --</option>
                  {deals.map(d => (
                    <option key={d.id} value={d.id}>{d.customerName}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Interaction Type</label>
              <div className="grid grid-cols-4 gap-3">
                {INTERACTION_TYPES.map(t => {
                  const Icon = t.icon;
                  const isSelected = type === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600" 
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Example: Customer asked whether deployment can be completed within 30 days…"
                className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-2">The AI will automatically extract commitments, priorities, risks, and update the Deal Memory.</p>
            </div>
          </div>
        )}

        {!isProcessing && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col justify-end gap-3">
            {apiError && <p className="text-red-500 text-sm mb-2 text-right">{apiError}</p>}
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleProcess}
                disabled={!content.trim() || (!dealId && !selectedDealId)}
                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4" /> Analyze & Retain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

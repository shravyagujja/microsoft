import { useState, useEffect } from 'react';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import { generateResponse } from '../../api/deals';

export const Composer = ({ dealId, deal }: { dealId: string, deal?: any }) => {
  const [draft, setDraft] = useState(`Generating response...`);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [useHindsight, setUseHindsight] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!useHindsight) return;
    setLoading(true);
    setDraft('Generating response...');
    try {
      const { data } = await generateResponse(dealId, {});
      if (data && data.draft) {
        setDraft(data.draft);
        setKeyPoints(data.keyPoints || []);
      } else {
        setDraft('Failed to generate response. Check API quota.');
      }
    } catch (e) {
      setDraft('Failed to generate response.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [dealId]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-indigo-50/50">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-900">AI Response</h2>
      </div>

      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Latest Customer Message</p>
        <p className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-3">
          "{deal?.interactions?.length ? deal.interactions[deal.interactions.length - 1].content : 'No interactions yet.'}"
        </p>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI-Generated Draft</p>
          <div className="flex gap-2">
            <button onClick={handleGenerate} disabled={loading || !useHindsight} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Regenerate">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => { navigator.clipboard.writeText(useHindsight ? draft : "The customer seems concerned about deployment."); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Copy">
              {copied ? <span className="text-xs text-indigo-600 font-bold">Copied!</span> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={() => setDraft('')} className="text-xs text-red-500 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors" title="Clear">
              Clear
            </button>
          </div>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button 
            onClick={() => setUseHindsight(false)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${!useHindsight ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Without Hindsight
          </button>
          <button 
            onClick={() => setUseHindsight(true)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold rounded-md transition-colors ${useHindsight ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Sparkles className="w-3 h-3" /> With Hindsight
          </button>
        </div>

        <div className="flex-1 overflow-auto flex flex-col">
          {!useHindsight ? (
            <div className="flex-1 w-full p-4 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-sans leading-relaxed flex items-center justify-center text-center">
              <p className="text-gray-500 italic">"The customer seems concerned about deployment."</p>
            </div>
          ) : (
            <textarea 
              className="flex-1 w-full p-4 text-sm text-gray-800 bg-gray-50 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-sans leading-relaxed"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          )}
        </div>
        
        <div className="mt-4 flex flex-col gap-2 min-h-[40px]">
          {useHindsight && keyPoints.length > 0 && (
            <>
              <p className="text-xs text-gray-500 font-medium">Based on:</p>
              <div className="flex flex-wrap gap-2">
                {keyPoints.map((kp, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{kp}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import type { Interaction } from '../../types';
import { DEMO_INTERACTIONS } from '../../data/demoData';
import { Mail, Phone, Video, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

const getTagColor = (tag: string) => {
  const lower = tag.toLowerCase();
  if (lower.includes('requirement')) return 'bg-blue-100 text-blue-700';
  if (lower.includes('objection') || lower.includes('risk') || lower.includes('concern')) return 'bg-red-100 text-red-700';
  if (lower.includes('commitment')) return 'bg-purple-100 text-purple-700';
  if (lower.includes('stakeholder')) return 'bg-green-100 text-green-700';
  if (lower.includes('priority')) return 'bg-amber-100 text-amber-700';
  if (lower.includes('outcome')) return 'bg-teal-100 text-teal-700';
  return 'bg-gray-100 text-gray-700';
};

const getIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="w-4 h-4" />;
    case 'meeting': return <Video className="w-4 h-4" />;
    case 'call': return <Phone className="w-4 h-4" />;
    case 'note': return <FileText className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

import { fetchTimeline } from '../../api/deals';

export const Timeline = ({ dealId }: { dealId: string }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    const loadTimeline = async () => {
      const { data } = await fetchTimeline(dealId);
      if (data) {
        setInteractions(data);
      } else {
        setInteractions(DEMO_INTERACTIONS);
      }
    };
    loadTimeline();
  }, [dealId]);

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Deal Timeline</h2>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {interactions.map((interaction) => (
          <div key={interaction.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
              {getIcon(interaction.type)}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-900 text-sm">{interaction.speaker}</span>
                <span className="text-xs text-slate-500 font-medium">W{interaction.week} D{interaction.day}</span>
              </div>
              <p className="text-slate-600 text-sm mb-3">"{interaction.content}"</p>
              <div className="flex flex-wrap gap-1.5">
                {interaction.nlpTags.map(tag => (
                  <span key={tag} className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", getTagColor(tag))}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

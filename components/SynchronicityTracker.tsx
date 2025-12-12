import React, { useState } from 'react';
import { Eye, Plus, Terminal } from 'lucide-react';

interface Props {
  initialAnalysis: string;
}

interface Omen {
  id: number;
  text: string;
  timestamp: string;
}

const SynchronicityTracker: React.FC<Props> = ({ initialAnalysis }) => {
  const [omens, setOmens] = useState<Omen[]>([]);
  const [newOmen, setNewOmen] = useState('');

  const addOmen = () => {
    if (!newOmen.trim()) return;
    const omen: Omen = {
      id: Date.now(),
      text: newOmen,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    setOmens([omen, ...omens]);
    setNewOmen('');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col h-full font-mono text-xs">
      <h3 className="text-cyan-400 tech-font text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
        <Eye size={14} /> Synchronicity Tracker
      </h3>

      {/* Analysis Block */}
      <div className="mb-4 p-3 bg-cyan-900/10 border-l-2 border-cyan-500 text-cyan-200 italic">
        RUN_ANALYSIS: {initialAnalysis}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={newOmen}
          onChange={(e) => setNewOmen(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addOmen()}
          placeholder="Log visual/auditory signal..."
          className="flex-grow bg-slate-900 border border-slate-700 text-slate-300 p-2 rounded focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button 
          onClick={addOmen}
          className="bg-slate-800 hover:bg-slate-700 text-amber-500 p-2 rounded transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Log */}
      <div className="flex-grow overflow-y-auto space-y-2 max-h-[150px] pr-2 custom-scrollbar">
        {omens.length === 0 && <span className="text-slate-600">No additional signals detected.</span>}
        {omens.map(omen => (
          <div key={omen.id} className="flex gap-2 text-slate-400 border-b border-slate-800 pb-1">
            <span className="text-slate-600">[{omen.timestamp}]</span>
            <span className="text-amber-100/80">{omen.text}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-slate-600 flex items-center gap-1">
        <Terminal size={10} /> <span className="animate-pulse">LISTENING...</span>
      </div>
    </div>
  );
};

export default SynchronicityTracker;
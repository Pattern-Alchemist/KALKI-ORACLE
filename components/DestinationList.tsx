import React, { useState } from 'react';
import { DestinationScore } from '../types';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  data: DestinationScore[];
}

const DestinationList: React.FC<Props> = ({ data }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 flex flex-col h-full overflow-hidden">
      <h3 className="text-cyan-400 tech-font text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
        <TrendingUp size={14} /> Destiny Vector Rankings
      </h3>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 space-y-3">
        {data.map((dest, index) => {
          const isExpanded = expandedIndex === index;
          // Simulate trend based on index (just for visual flavor)
          const TrendIcon = index === 0 ? TrendingUp : (index < 3 ? Minus : TrendingDown);
          const trendColor = index === 0 ? "text-amber-500" : (index < 3 ? "text-cyan-500" : "text-slate-500");
          const scoreColor = dest.score > 80 ? "text-amber-400" : (dest.score > 50 ? "text-cyan-400" : "text-slate-400");

          return (
            <div 
              key={dest.name}
              onClick={() => toggleExpand(index)}
              className={`
                border rounded transition-all duration-300 cursor-pointer overflow-hidden
                ${isExpanded 
                  ? 'bg-slate-800/80 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40'
                }
              `}
            >
              {/* Card Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`tech-font text-xs font-bold w-4 ${index === 0 ? 'text-amber-500' : 'text-slate-600'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className={`mythic-font text-sm font-bold tracking-wider ${isExpanded ? 'text-white' : 'text-slate-300'}`}>
                      {dest.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="text-right">
                      <div className={`tech-font text-sm font-bold ${scoreColor}`}>
                        {dest.score}%
                      </div>
                   </div>
                   <TrendIcon size={14} className={trendColor} />
                   {isExpanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </div>
              </div>

              {/* Expandable Details */}
              <div 
                className={`
                  transition-[max-height,opacity] duration-300 ease-in-out
                  ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="p-3 pt-0 border-t border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 mb-1">
                    Oracle Reasoning
                  </p>
                  <p className="text-xs text-slate-300 italic leading-relaxed font-light">
                    "{dest.reasoning}"
                  </p>
                  
                  {/* Decorative Bar */}
                  <div className="mt-3 h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500/50" 
                      style={{ width: `${dest.score}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DestinationList;
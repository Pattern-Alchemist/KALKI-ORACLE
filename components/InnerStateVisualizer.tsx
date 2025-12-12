import React from 'react';
import { Activity } from 'lucide-react';

interface Props {
  stateDescription: string;
}

const InnerStateVisualizer: React.FC<Props> = ({ stateDescription }) => {
  // Determine color based on simple string matching (fallback to cyan)
  let colorClass = "from-cyan-500 to-blue-600";
  let pulseSpeed = "2s";
  
  const desc = stateDescription.toLowerCase();
  if (desc.includes("fire") || desc.includes("anger") || desc.includes("war")) {
    colorClass = "from-red-500 to-amber-600";
    pulseSpeed = "0.5s";
  } else if (desc.includes("void") || desc.includes("sad") || desc.includes("empty")) {
    colorClass = "from-purple-900 to-slate-900";
    pulseSpeed = "4s";
  } else if (desc.includes("peace") || desc.includes("calm") || desc.includes("healing")) {
    colorClass = "from-emerald-400 to-teal-600";
    pulseSpeed = "3s";
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 flex flex-col justify-between h-full relative overflow-hidden">
       <h3 className="text-cyan-400 tech-font text-xs uppercase tracking-widest mb-4 flex items-center gap-2 z-10">
        <Activity size={14} /> Inner State Scanner
      </h3>

      <div className="flex-grow flex items-center justify-center relative">
        {/* Animated Core */}
        <div 
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${colorClass} blur-xl opacity-60 animate-pulse`}
            style={{ animationDuration: pulseSpeed }}
        ></div>
        <div 
            className={`absolute w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} opacity-90 mix-blend-screen shadow-[0_0_30px_rgba(255,255,255,0.2)]`}
        ></div>
        
        {/* Orbital Ring */}
        <div className="absolute w-32 h-32 border border-slate-600/30 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }}>
           <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-glow"></div>
        </div>
      </div>

      <p className="text-center text-slate-300 tech-font text-sm uppercase tracking-widest mt-4 z-10">
        "{stateDescription}"
      </p>
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    </div>
  );
};

export default InnerStateVisualizer;
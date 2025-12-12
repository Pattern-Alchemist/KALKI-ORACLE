import React from 'react';
import { OracleResponse } from '../types';
import DestinyMap from './DestinyMap';
import DestinationList from './DestinationList'; // Replaced KarmicCharts
import KarmicWeatherWidget from './KarmicWeatherWidget';
import InnerStateVisualizer from './InnerStateVisualizer';
import SynchronicityTracker from './SynchronicityTracker';
import { AlertTriangle, ArrowRight, Sun, Moon } from 'lucide-react';

interface Props {
  response: OracleResponse;
  currentLocation: string;
  emotionalState: string;
  onReset: () => void;
}

const OracleOutput: React.FC<Props> = ({ response, currentLocation, emotionalState, onReset }) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Header / Decree */}
      <div className="text-center space-y-4 mb-8">
        <h2 className="mythic-font text-xl text-amber-500 tracking-[0.2em] uppercase opacity-80">The Oracle Speaks</h2>
        <div className="relative p-6 md:p-8 border-y border-amber-500/30 bg-gradient-to-b from-amber-900/10 to-transparent">
          <p className="mythic-font text-2xl md:text-4xl text-amber-100 font-bold leading-relaxed animate-pulse-glow">
            {response.finalDecree}
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Data & Diagnostics (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Inner State & Karmic Weather Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
             <KarmicWeatherWidget weather={response.karmicWeather} />
             <InnerStateVisualizer stateDescription={emotionalState} />
          </div>

          {/* Text Analysis */}
          <div className="bg-slate-900/50 p-6 rounded-lg border-l-4 border-cyan-500">
            <h3 className="flex items-center gap-2 text-cyan-400 tech-font uppercase tracking-widest text-sm mb-3">
              <Sun size={16} /> Cosmic Reading
            </h3>
            <p className="text-slate-300 leading-7 font-light italic text-sm">
              "{response.cosmicReading}"
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 className="flex items-center gap-2 text-purple-400 tech-font uppercase tracking-widest text-sm mb-3">
              <Moon size={16} /> Karmic Grid Analysis
            </h3>
            <p className="text-slate-300 leading-7 font-light text-sm">
              {response.karmicGrid}
            </p>
          </div>

        </div>

        {/* MIDDLE COLUMN: The Map (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex-grow min-h-[500px] bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden relative">
             <div className="absolute inset-0">
                <DestinyMap 
                  destinations={response.destinations} 
                  currentLocationName={currentLocation}
                  finalDestination={response.nextDestination}
                />
             </div>
          </div>
          
           {/* Push / Pull Mini-Bar */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-900/80 p-3 rounded border border-green-900/50">
                <h4 className="text-green-500 tech-font text-[10px] uppercase mb-1">Universal Push</h4>
                <p className="text-xs text-slate-300">{response.universalPush}</p>
             </div>
             <div className="bg-slate-900/80 p-3 rounded border border-red-900/50">
                <h4 className="text-red-500 tech-font text-[10px] uppercase mb-1">Universal Pull</h4>
                <p className="text-xs text-slate-300">{response.universalPull}</p>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tracking & Stock List (3 cols) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
           <SynchronicityTracker initialAnalysis={response.synchronicityMeaning} />
           <div className="flex-grow">
             <DestinationList data={response.destinations} />
           </div>
        </div>

      </div>

      {/* Footer Action */}
      <div className="flex justify-center pt-8 pb-12">
        <button 
          onClick={onReset}
          className="group flex items-center gap-2 px-8 py-3 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 transition-all uppercase tracking-widest text-sm rounded hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        >
          <AlertTriangle size={16} className="group-hover:text-amber-500 transition-colors" />
           recalibrate sensors
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default OracleOutput;
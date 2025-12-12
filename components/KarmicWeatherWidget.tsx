import React from 'react';
import { KarmicWeather } from '../types';
import { CloudLightning, Clock, Star, Zap } from 'lucide-react';

interface Props {
  weather: KarmicWeather;
}

const KarmicWeatherWidget: React.FC<Props> = ({ weather }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
        <CloudLightning size={80} />
      </div>
      
      <h3 className="text-cyan-400 tech-font text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap size={14} /> Karmic Weather Report
      </h3>

      <div className="grid grid-cols-2 gap-4">
        
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Gate Status</p>
          <p className="text-sm font-bold text-slate-200 mythic-font">{weather.planetaryGateStatus}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Dominant Body</p>
          <p className="text-sm font-bold text-amber-500 mythic-font flex items-center gap-2">
            <Star size={12} /> {weather.dominantCelestialBody}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pressure Density</p>
          <div className="flex items-center gap-2">
             <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-900 to-cyan-400" 
                  style={{ width: `${weather.energyDensity}%` }}
                />
             </div>
             <span className="text-xs text-cyan-400 font-mono">{weather.energyDensity}%</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Time Window</p>
          <p className="text-sm font-bold text-slate-200 mythic-font flex items-center gap-2">
             <Clock size={12} /> {weather.auspiciousTimeWindow}
          </p>
        </div>

      </div>
    </div>
  );
};

export default KarmicWeatherWidget;
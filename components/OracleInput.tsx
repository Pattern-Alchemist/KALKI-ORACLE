import React from 'react';
import { OracleInputData } from '../types';
import { MISSION_MODES, LIFE_PATTERNS } from '../constants';
import { Compass, Zap, MapPin, Activity, Radio } from 'lucide-react';

interface Props {
  data: OracleInputData;
  onChange: (field: keyof OracleInputData, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const OracleInput: React.FC<Props> = ({ data, onChange, onSubmit, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-md shadow-2xl">
      <div className="space-y-6">
        
        {/* Current Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-cyan-400 tech-font uppercase tracking-widest text-sm">
            <MapPin size={16} /> Current Coordinates
          </label>
          <input
            type="text"
            value={data.currentLocation}
            onChange={(e) => onChange('currentLocation', e.target.value)}
            placeholder="Where does the Avatar stand?"
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 p-3 rounded focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-600"
          />
        </div>

        {/* Emotional State */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-cyan-400 tech-font uppercase tracking-widest text-sm">
            <Activity size={16} /> Inner Weather
          </label>
          <input
            type="text"
            value={data.emotionalState}
            onChange={(e) => onChange('emotionalState', e.target.value)}
            placeholder="Storm, Void, Fire, Ice..."
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 p-3 rounded focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-600"
          />
        </div>

        {/* Life Pattern */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-cyan-400 tech-font uppercase tracking-widest text-sm">
            <Radio size={16} /> Current Life Pattern
          </label>
          <select
            value={data.lifePattern}
            onChange={(e) => onChange('lifePattern', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 p-3 rounded focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">Select Pattern...</option>
            {LIFE_PATTERNS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Goal */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-cyan-400 tech-font uppercase tracking-widest text-sm">
            <Compass size={16} /> Mission Objective
          </label>
          <select
            value={data.goalOfMovement}
            onChange={(e) => onChange('goalOfMovement', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 p-3 rounded focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">Select Objective...</option>
            {MISSION_MODES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Intuition */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-cyan-400 tech-font uppercase tracking-widest text-sm">
            <Zap size={16} /> Intuition Pulse
          </label>
          <textarea
            value={data.intuitionPulse}
            onChange={(e) => onChange('intuitionPulse', e.target.value)}
            placeholder="What pulls you? What resists you? Describe the omens."
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 p-3 rounded h-24 focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-600 resize-none"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || !data.currentLocation}
          className={`w-full py-4 mt-4 font-bold text-lg tracking-widest uppercase transition-all duration-300 rounded
            ${isLoading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-900 to-slate-900 text-cyan-400 border border-cyan-700 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:text-white'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">✴</span> Communing with the Grid...
            </span>
          ) : (
            "Consult the Oracle"
          )}
        </button>

      </div>
    </div>
  );
};

export default OracleInput;
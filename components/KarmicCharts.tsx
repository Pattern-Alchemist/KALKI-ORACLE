import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { DestinationScore } from '../types';

interface Props {
  data: DestinationScore[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
        <p className="tech-font text-cyan-400 text-sm font-bold">{label}</p>
        <p className="text-white text-xs">Alignment: {payload[0].value}%</p>
        <p className="text-slate-400 text-[10px] mt-1 italic max-w-[200px]">
          {payload[0].payload.reasoning}
        </p>
      </div>
    );
  }
  return null;
};

const KarmicCharts: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-[300px] bg-slate-900/30 border border-slate-800 rounded-xl p-4">
      <h3 className="text-cyan-500 tech-font text-xs uppercase tracking-widest mb-4">Destiny Vector Alignment</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Share Tech Mono' }} 
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b', opacity: 0.4}} />
          <Bar dataKey="score" barSize={20} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#0891b2'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KarmicCharts;
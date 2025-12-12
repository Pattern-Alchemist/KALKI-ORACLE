import React, { useState } from 'react';
import { AppState, OracleInputData, OracleResponse } from './types';
import OracleInput from './components/OracleInput';
import OracleOutput from './components/OracleOutput';
import { generateOracleReading } from './services/oracleService';

const INITIAL_INPUT: OracleInputData = {
  currentLocation: '',
  emotionalState: '',
  lifePattern: '',
  goalOfMovement: '',
  intuitionPulse: ''
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [inputData, setInputData] = useState<OracleInputData>(INITIAL_INPUT);
  const [oracleResponse, setOracleResponse] = useState<OracleResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (field: keyof OracleInputData, value: string) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setAppState(AppState.CALCULATING);
    setErrorMsg(null);
    try {
      const response = await generateOracleReading(inputData);
      setOracleResponse(response);
      setAppState(AppState.REVEALED);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "The cosmic link was severed. Try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setOracleResponse(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 selection:bg-cyan-900 selection:text-white overflow-x-hidden">
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-900/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4">
             <div className="w-16 h-16 mx-auto border-2 border-amber-500 rounded-full flex items-center justify-center animate-spin-slow" style={{ animationDuration: '20s' }}>
                <div className="w-12 h-12 border border-cyan-400 rounded-full flex items-center justify-center rotate-45">
                   <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
             </div>
          </div>
          <h1 className="mythic-font text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-500 tracking-tighter mb-2">
            KALKI DESTINY ORACLE
          </h1>
          <p className="tech-font text-cyan-500/60 text-xs md:text-sm tracking-[0.3em] uppercase">
            Planetary Navigation System • Version 9.0 (Kaliyuga End-Cycle)
          </p>
        </header>

        {/* Content Switcher */}
        <main className="flex-grow flex flex-col items-center justify-center w-full">
          
          {appState === AppState.IDLE && (
            <div className="w-full animate-in fade-in zoom-in duration-500">
               <OracleInput 
                  data={inputData}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  isLoading={false}
               />
            </div>
          )}

          {appState === AppState.CALCULATING && (
             <div className="w-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
                <div className="relative w-32 h-32">
                   <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-4 border-r-4 border-amber-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                   <div className="absolute inset-8 border-b-4 border-white rounded-full animate-pulse"></div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="mythic-font text-2xl text-slate-200">Consulting the Akashic Records...</h2>
                  <p className="tech-font text-cyan-500/70 text-sm">Calculating Karmic Vectors • Parsing Shadow Density</p>
                </div>
             </div>
          )}

          {appState === AppState.REVEALED && oracleResponse && (
            <OracleOutput 
              response={oracleResponse} 
              currentLocation={inputData.currentLocation}
              emotionalState={inputData.emotionalState}
              onReset={handleReset}
            />
          )}

          {appState === AppState.ERROR && (
             <div className="text-center space-y-6 max-w-md mx-auto animate-in shake">
                <div className="text-red-500 text-6xl mx-auto">⚠</div>
                <h3 className="mythic-font text-xl text-red-400">Signal Interrupted</h3>
                <p className="text-slate-400">{errorMsg}</p>
                <button 
                  onClick={handleReset}
                  className="px-6 py-2 border border-slate-700 hover:bg-slate-800 rounded tech-font uppercase text-xs tracking-widest transition-colors"
                >
                  Reset System
                </button>
             </div>
          )}

        </main>
        
        <footer className="mt-12 text-center">
           <p className="text-[10px] text-slate-700 tech-font uppercase tracking-widest">
              Om Namah Shivaya • Jai Kalki
           </p>
        </footer>

      </div>
    </div>
  );
};

export default App;
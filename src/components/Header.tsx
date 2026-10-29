import React from 'react';
import { Activity, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'twin_eye' | 'pipeline_compare' | 'benchmarks' | 'whitepaper';
  onSelectTab: (tab: 'twin_eye' | 'pipeline_compare' | 'benchmarks' | 'whitepaper') => void;
  onResetSimulation: () => void;
  onOpenDeployModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onResetSimulation,
  onOpenDeployModal,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-[#090D16]/95 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Activity className="w-4 h-4" />
        </div>
        <span className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap">
          Project AURA <span className="text-cyan-400 font-normal">· Wearable Physiology Lab</span>
        </span>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('twin_eye')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
            activeTab === 'twin_eye' ? 'text-cyan-400 border-cyan-400 font-semibold' : 'border-transparent text-slate-400'
          }`}
        >
          Digital Twin Eye View
        </button>
        <button
          onClick={() => onSelectTab('pipeline_compare')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
            activeTab === 'pipeline_compare' ? 'text-cyan-400 border-cyan-400 font-semibold' : 'border-transparent text-slate-400'
          }`}
        >
          4-Stage vs 3D Model
        </button>
        <button
          onClick={() => onSelectTab('benchmarks')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
            activeTab === 'benchmarks' ? 'text-cyan-400 border-cyan-400 font-semibold' : 'border-transparent text-slate-400'
          }`}
        >
          Difficult Edge Cases
        </button>
        <button
          onClick={() => onSelectTab('whitepaper')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
            activeTab === 'whitepaper' ? 'text-cyan-400 border-cyan-400 font-semibold' : 'border-transparent text-slate-400'
          }`}
        >
          Clinical Framework
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenDeployModal}
          className="px-3.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
        >
          <span>GitHub Pages Guide</span>
        </button>
        <button
          onClick={onResetSimulation}
          className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          Reset
        </button>
      </div>
    </header>
  );
};

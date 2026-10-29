import React from 'react';
import { SIMULATION_PRESETS } from '../data/simulationPresets';
import { SimulationContext, SimulationModeId } from '../types/simulator';
import { User, Flame, Zap, ShieldAlert, BatteryLow, RefreshCw, Layers, Radio, Sliders } from 'lucide-react';

interface ModeSelectorBarProps {
  currentModeId: SimulationModeId;
  onSelectMode: (modeId: SimulationModeId) => void;
  context: SimulationContext;
  onUpdateContext: (partial: Partial<SimulationContext>) => void;
}

const MODE_ICONS: Record<SimulationModeId, React.ReactNode> = {
  resting_baseline: <User className="w-3.5 h-3.5 text-cyan-400" />,
  physical_exercise: <Flame className="w-3.5 h-3.5 text-emerald-400" />,
  acute_panic: <Zap className="w-3.5 h-3.5 text-rose-400" />,
  freeze_shutdown: <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />,
  chronic_exhaustion: <BatteryLow className="w-3.5 h-3.5 text-amber-400" />,
  resilient_triggers: <RefreshCw className="w-3.5 h-3.5 text-teal-400" />,
  allostatic_overload: <Layers className="w-3.5 h-3.5 text-red-400" />,
  sensor_artifact: <Radio className="w-3.5 h-3.5 text-slate-400" />,
  custom_sandbox: <Sliders className="w-3.5 h-3.5 text-purple-400" />,
};

export const ModeSelectorBar: React.FC<ModeSelectorBarProps> = ({
  currentModeId,
  onSelectMode,
  context,
  onUpdateContext,
}) => {
  const activePreset = SIMULATION_PRESETS.find((p) => p.id === currentModeId) || SIMULATION_PRESETS[0];

  return (
    <div className="border-b border-slate-800 bg-[#0B0F19] px-6 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Subject Context Kicker */}
        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
          <span className="font-semibold text-slate-200">Subject #082 (Sarah M.)</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Ambient {context.environmentTemp.toFixed(1)}°C</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Caffeine {context.caffeineIntakeMg}mg</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Sleep Index {context.sleepQualityScore}%</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className={context.isMoving ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
            {context.isMoving ? 'Moving / Locomotion' : 'Stationary'}
          </span>
        </div>

        {/* Quick Context Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateContext({ isMoving: !context.isMoving })}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
              context.isMoving
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {context.isMoving ? 'Movement Active' : '+ Simulate Motion'}
          </button>
          <button
            onClick={() => onUpdateContext({ isSensorLoose: !context.isSensorLoose })}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
              context.isSensorLoose
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {context.isSensorLoose ? 'Loose Band (Noise ON)' : '+ Loosen Wristband'}
          </button>
        </div>
      </div>

      {/* Mode Buttons Grid / Horizontal Scroll */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {SIMULATION_PRESETS.map((preset) => {
          const isSelected = preset.id === currentModeId;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectMode(preset.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              {MODE_ICONS[preset.id]}
              <span>{preset.name}</span>
            </button>
          );
        })}
      </div>

      {/* Preset Insight Banner */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between text-xs gap-2">
        <div className="text-slate-300">
          <span className="font-semibold text-cyan-400">{activePreset.name}:</span>{' '}
          <span className="text-slate-400">{activePreset.shortDescription}</span>
        </div>
        <div className="text-slate-400 text-[11px] italic">
          Clinical reality: {activePreset.clinicalContext}
        </div>
      </div>
    </div>
  );
};

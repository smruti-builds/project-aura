import React, { useState } from 'react';
import { DIFFICULT_BENCHMARK_CASES } from '../data/simulationPresets';
import { SimulationModeId } from '../types/simulator';
import { AlertCircle, CheckCircle, Play, ShieldAlert, XCircle, ArrowUpRight, Award, Zap } from 'lucide-react';

interface BenchmarkSuiteViewProps {
  onLoadCasePreset: (modeId: SimulationModeId) => void;
}

export const BenchmarkSuiteView: React.FC<BenchmarkSuiteViewProps> = ({ onLoadCasePreset }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case_1');

  const selectedCase = DIFFICULT_BENCHMARK_CASES.find((c) => c.id === selectedCaseId) || DIFFICULT_BENCHMARK_CASES[0];

  // Map case ID to simulation preset ID
  const caseToPresetMap: Record<string, SimulationModeId> = {
    case_1: 'physical_exercise',
    case_2: 'acute_panic',
    case_3: 'physical_exercise',
    case_4: 'freeze_shutdown',
    case_5: 'resilient_triggers',
    case_6: 'allostatic_overload',
    case_7: 'sensor_artifact',
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Difficult Cases Validation Suite (Clinical Benchmark)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              How do you know if a wearable stress model actually works? Evaluating algorithms only on straightforward
              panic episodes creates a false sense of security. Real life is full of ambiguous physiological states.
              Test both frameworks against these 7 adversarial scenarios.
            </p>
          </div>

          {/* Metric Comparison Badges */}
          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-2.5 text-rose-300 text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase">Naive 4-Stage</div>
              <div className="text-lg font-bold">14.2%</div>
              <div className="text-[10px] text-rose-400">1 / 7 Correct Cases</div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2.5 text-cyan-300 text-center min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase">3D Parallel Model</div>
              <div className="text-lg font-bold">100%</div>
              <div className="text-[10px] text-emerald-400">7 / 7 Appropriately Handled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Case Selector (Left) & Deep Inspection (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7 Benchmark Cases List */}
        <div className="lg:col-span-5 space-y-2">
          {DIFFICULT_BENCHMARK_CASES.map((item, index) => {
            const isSelected = item.id === selectedCaseId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedCaseId(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-sm'
                    : 'bg-[#0D121F] border-slate-800 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    0{index + 1}. {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                    {item.naiveModelVerdict.errorType}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {item.scenario}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Architectural Comparison for Selected Case */}
        <div className="lg:col-span-7 bg-[#0D121F] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                  Adversarial Test Case Specification
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">{selectedCase.title}</h3>
              </div>
              <button
                onClick={() => onLoadCasePreset(caseToPresetMap[selectedCase.id])}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Play className="w-3.5 h-3.5 fill-cyan-300" />
                <span>Load Into Live Simulator</span>
              </button>
            </div>

            {/* Scenario Ground Truth */}
            <div className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 text-xs space-y-1.5">
              <div className="text-slate-400 font-mono text-[10px] uppercase">Telemetry & Scenario Description:</div>
              <div className="text-slate-200">{selectedCase.scenario}</div>
              <div className="text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="text-emerald-400 font-semibold">Clinical Ground Truth:</span> {selectedCase.expectedTrueState}
              </div>
            </div>

            {/* Two Models Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Naive 4-Stage Verdict */}
              <div className="p-4 bg-rose-500/5 border border-rose-500/25 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    Model A: Naive 4-Stage
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">
                    FAIL
                  </span>
                </div>
                <div className="font-mono text-slate-200 bg-slate-950 p-2 rounded text-[11px]">
                  {selectedCase.naiveModelVerdict.label}
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  <span className="text-rose-400 font-semibold">Consequence:</span>{' '}
                  {selectedCase.naiveModelVerdict.consequence}
                </div>
              </div>

              {/* 3D Parallel Model Verdict */}
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/25 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    Model B: 3D Parallel
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                    PASS
                  </span>
                </div>
                <div className="font-mono text-slate-200 bg-slate-950 p-2 rounded text-[11px]">
                  {selectedCase.threeDModelVerdict.label}
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  <span className="text-cyan-400 font-semibold">Clinical Merit:</span>{' '}
                  {selectedCase.threeDModelVerdict.clinicalMerit}
                </div>
              </div>
            </div>

            {/* Rationale Breakdown */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
              <span className="font-semibold text-slate-200">How the 3-Dimensional Model Resolves This:</span>
              <p className="text-slate-400 leading-relaxed">
                {selectedCase.threeDModelVerdict.rationale}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

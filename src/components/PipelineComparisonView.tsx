import React, { useState } from 'react';
import {
  PhysiologicalSample,
  SimulationContext,
  SimulationPreset,
  StagePipelineStatus,
  ThreeDimensionalModelStatus,
} from '../types/simulator';
import { AlertCircle, CheckCircle, ChevronRight, HelpCircle, Layers, ShieldCheck, XCircle } from 'lucide-react';

interface PipelineComparisonViewProps {
  sample: PhysiologicalSample;
  context: SimulationContext;
  preset: SimulationPreset;
  stagePipeline: StagePipelineStatus;
  threeDModel: ThreeDimensionalModelStatus;
}

export const PipelineComparisonView: React.FC<PipelineComparisonViewProps> = ({
  sample,
  context,
  preset,
  stagePipeline,
  threeDModel,
}) => {
  const [selectedStage, setSelectedStage] = useState<1 | 2 | 3 | 4>(2);

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Dual Architecture Comparison: Classic 4-Stage vs 3D Parallel Model</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Why do first-generation wearable stress trackers fail in real life? The classic pipeline assumes a linear
              sequence from baseline to trigger to recovery to overload. The proposed 3-Dimensional model tracks
              Physiological Activation, Persistence/Recovery Trajectory, and Self-Reported Readiness in parallel.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="text-slate-400">Current Mode:</span>
            <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-semibold">
              {preset.name}
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Architectural Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Model A - The Classic 4-Stage Rigid Pipeline */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="text-sm font-bold text-slate-100">Model A: Classic 4-Stage Linear Pipeline</h3>
              </div>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                Fragile Assumptions
              </span>
            </div>

            {/* Stages Vertical Flow */}
            <div className="space-y-4 my-4">
              {/* Stage 1 */}
              <div
                onClick={() => setSelectedStage(1)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedStage === 1
                    ? 'bg-slate-900 border-cyan-500/50'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Stage 1 — Baseline Acquisition</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Fixed {stagePipeline.stage1.baselineHr} bpm
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">Assumption:</span> Normal HR, HRV, EDA are fixed and can be learned simply.
                </div>
                {stagePipeline.stage1.baselineDriftDetected && (
                  <div className="mt-1.5 text-[11px] text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Baseline drift detected: +{stagePipeline.stage1.driftMagnitudeBpm} bpm (Caffeine/Circadian)</span>
                  </div>
                )}
              </div>

              {/* Stage 2 */}
              <div
                onClick={() => setSelectedStage(2)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedStage === 2
                    ? 'bg-slate-900 border-cyan-500/50'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Stage 2 — Trigger Response</span>
                  <span
                    className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                      stagePipeline.stage2.triggerDetected
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {stagePipeline.stage2.naiveLabel}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">Assumption:</span> Any sharp deviation from baseline indicates an emotional trigger.
                </div>
                {stagePipeline.stage2.confoundingFactors.length > 0 && (
                  <div className="mt-1.5 text-[11px] text-rose-300 space-y-0.5">
                    {stagePipeline.stage2.confoundingFactors.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>Confounder: {c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stage 3 */}
              <div
                onClick={() => setSelectedStage(3)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedStage === 3
                    ? 'bg-slate-900 border-cyan-500/50'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Stage 3 — Recovery Check</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Physio Recovery: {stagePipeline.stage3.physiologicalRecoveryProgress}%
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">Assumption:</span> Returning towards baseline means the user is recovered.
                </div>
                {stagePipeline.stage3.physiologicalVsEmotionalMatch === 'blunted_arousal' && (
                  <div className="mt-1.5 text-[11px] text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Mismatch: Vitals elevated by exertion, but perceived emotional distress is zero.</span>
                  </div>
                )}
                {stagePipeline.stage3.physiologicalVsEmotionalMatch === 'lagging_emotional' && (
                  <div className="mt-1.5 text-[11px] text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Silent crisis: Body appears physiologically calm, but subject reports high distress (freeze/numbness).</span>
                  </div>
                )}
              </div>

              {/* Stage 4 */}
              <div
                onClick={() => setSelectedStage(4)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedStage === 4
                    ? 'bg-slate-900 border-cyan-500/50'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Stage 4 — Possible Overload Alarm</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Trigger Count: {stagePipeline.stage4.triggerCountWindow}/3
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">Assumption:</span> 3 triggers + slow recovery automatically equals clinical overload.
                </div>
                <div className="mt-1.5 text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>Rigid Action:</span>
                  <span className="font-mono text-rose-400 uppercase font-semibold">
                    {stagePipeline.stage4.interventionRecommendation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Model A Flaw Diagnosis Callout */}
          <div className="mt-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Why Model A Fails on This Scenario:</span>
            </div>
            <p className="mt-1 text-slate-300 leading-relaxed">
              {preset.whyNaiveModelFails}
            </p>
          </div>
        </div>

        {/* Right Column: Model B - The 3-Dimensional Parallel Model */}
        <div className="bg-[#0D121F] border border-cyan-500/40 rounded-xl p-5 flex flex-col justify-between shadow-lg shadow-cyan-950/20">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Model B: 3-Dimensional Parallel Model</h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                Context-Aware & Human-Centric
              </span>
            </div>

            {/* 3 Parallel Dimensions */}
            <div className="space-y-4 my-4">
              {/* Dimension 1 */}
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300">Dimension 1: Physiological Activation</span>
                  <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                    Score: {threeDModel.dimension1Activation.normalizedScore} / 100
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Measures distance from a <span className="text-slate-200 font-medium">context-aware baseline</span> (factoring movement, caffeine, sleep, SQI).
                </div>
                <div className="mt-2 text-[11px] text-slate-300 grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded font-mono">
                  <div>Adjusted Baseline: {threeDModel.dimension1Activation.contextAdjustedBaselineHr} bpm</div>
                  <div>Residual Δ: {threeDModel.dimension1Activation.movementAdjustedHrDelta} bpm</div>
                </div>
                <div className="mt-1 text-[11px] text-cyan-400">
                  Label: <span className="font-semibold">{threeDModel.dimension1Activation.category}</span> (No premature psychological diagnosis).
                </div>
              </div>

              {/* Dimension 2 */}
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300">Dimension 2: Persistence & Recovery Trajectory</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    Slope: {threeDModel.dimension2Persistence.recoverySlopeBpmPerMin} bpm/min
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Does not just count triggers; evaluates the <span className="text-slate-200 font-medium">recovery decay curve</span> and allostatic slope across time.
                </div>
                <div className="mt-2 text-[11px] text-slate-300 grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded font-mono">
                  <div>Trajectory: {threeDModel.dimension2Persistence.trajectoryStatus.replace('_', ' ')}</div>
                  <div>Allostatic Decay: {threeDModel.dimension2Persistence.allostaticDecayRate}x</div>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  Distinguishes productive high-focus bursts from accumulating autonomic exhaustion.
                </div>
              </div>

              {/* Dimension 3 */}
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300">Dimension 3: Self-Reported State & Readiness</span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    Readiness: {threeDModel.dimension3SelfReport.reportedReadiness} / 10
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Keeps the person's own feelings and agency strictly orthogonal to measured vitals.
                </div>
                <div className="mt-2 text-[11px] text-slate-300 grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded font-mono">
                  <div>Subject Distress: {threeDModel.dimension3SelfReport.reportedDistress} / 10</div>
                  <div>Privacy Mode: {threeDModel.dimension3SelfReport.agencyPreference}</div>
                </div>
                <div className="mt-1 text-[11px] text-emerald-400">
                  Subjective report is treated as valid ground truth, not an afterthought.
                </div>
              </div>
            </div>
          </div>

          {/* Proposed 3D Model Advantage */}
          <div className="mt-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>The 3-Dimensional Advantage:</span>
            </div>
            <p className="mt-1 text-slate-300 leading-relaxed">
              {preset.threeDAdvantage}
            </p>
          </div>
        </div>
      </div>

      {/* Deeper Challenge: The Missing Dimension Matrix */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">
            The Deeper Challenge: The Model May Be Missing an Entire Dimension
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Emotional overload is not always a high-arousal state. Traditional algorithms focus entirely on sympathetic
            surges, leaving hypo-arousal and masked distress completely undetected.
          </p>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Possible State</th>
                <th className="py-2.5 px-3">What Sensors Might Show</th>
                <th className="py-2.5 px-3">Why Arousal-Only Model Fails</th>
                <th className="py-2.5 px-3">How 3D Model Handles It</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/50">
                <td className="py-3 px-3 font-semibold text-rose-300">Panic</td>
                <td className="py-3 px-3 font-mono">Rapid HR, altered breathing, elevated EDA</td>
                <td className="py-3 px-3 text-slate-400">May confuse panic with exercise or acute physical stress.</td>
                <td className="py-3 px-3 text-cyan-300">Checks accelerometer; offers silent, non-stigmatizing grounding card.</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-3 px-3 font-semibold text-amber-300">Anger / Agitation</td>
                <td className="py-3 px-3 font-mono">Elevated arousal, movement, erratic speech</td>
                <td className="py-3 px-3 text-slate-400">Cannot reliably infer anger from arousal alone.</td>
                <td className="py-3 px-3 text-cyan-300">Labels "Physiological Arousal Detected"; does not claim emotion mind-reading.</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-3 px-3 font-semibold text-indigo-300">Freeze / Shutdown</td>
                <td className="py-3 px-3 font-mono">Reduced movement; low or paradoxical HR, flat EDA</td>
                <td className="py-3 px-3 text-rose-400 font-semibold">
                  MISTAKES DISTRESS FOR CALMNESS: Algorithm thinks the user is peacefully meditating.
                </td>
                <td className="py-3 px-3 text-cyan-300">
                  Tracks Dim 3 (Subjective Freeze & Immobility) to detect polyvagal dorsal shutdown.
                </td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-3 px-3 font-semibold text-purple-300">Emotional Exhaustion</td>
                <td className="py-3 px-3 font-mono">Depressed HRV, elevated resting HR drift</td>
                <td className="py-3 px-3 text-slate-400">Does not produce a single acute spike; normalizes bad baseline.</td>
                <td className="py-3 px-3 text-cyan-300">Compares rolling baselines against historical baseline to flag allostatic creep.</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-3 px-3 font-semibold text-slate-300">Dissociation / Numbness</td>
                <td className="py-3 px-3 font-mono">Subtle or blunted physiological changes</td>
                <td className="py-3 px-3 text-slate-400">Internal distress is invisible to standard wristband signals.</td>
                <td className="py-3 px-3 text-cyan-300">Gives priority to self-reported readiness and ecological momentary check-ins.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  PhysiologicalSample,
  SimulationContext,
  SimulationPreset,
  StagePipelineStatus,
  ThreeDimensionalModelStatus,
} from '../types/simulator';
import { Heart, Activity, Wind, Thermometer, Footprints, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DigitalTwinEyeViewProps {
  sample: PhysiologicalSample;
  context: SimulationContext;
  preset: SimulationPreset;
  stagePipeline: StagePipelineStatus;
  threeDModel: ThreeDimensionalModelStatus;
  history: PhysiologicalSample[];
  onOpenCheckin: () => void;
  onInjectStressor: () => void;
  onInjectRelaxation: () => void;
}

export const DigitalTwinEyeView: React.FC<DigitalTwinEyeViewProps> = ({
  sample,
  context,
  preset,
  stagePipeline,
  threeDModel,
  history,
  onOpenCheckin,
  onInjectStressor,
  onInjectRelaxation,
}) => {
  // Autonomic balance estimate:
  // Sympathetic: driven by HR, EDA, Respiration, Motion
  // Parasympathetic: driven by HRV RMSSD and slow breathing
  const sympatheticScore = Math.min(100, Math.max(10, (sample.heartRate - 50) * 0.9 + sample.edaTotal * 4));
  const parasympatheticScore = Math.min(100, Math.max(5, sample.hrvRmssd * 1.4));
  const autonomicBalanceRatio = (sympatheticScore / (sympatheticScore + parasympatheticScore)) * 100;

  // Recent HR sparkline coordinates
  const hrSparklinePoints = history.slice(-40).map((s, i) => {
    const x = (i / 39) * 160;
    const y = 45 - Math.min(40, Math.max(5, ((s.heartRate - 45) / 115) * 40));
    return `${x},${y}`;
  }).join(' ');

  // Respiration wave
  const respWavePoints = history.slice(-40).map((s, i) => {
    const x = (i / 39) * 160;
    const y = 25 - s.respirationPhase * 18;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      {/* Top Banner: Same Subject, Divergent States */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital Twin Physiological Avatar & Autonomic Axis */}
        <div className="lg:col-span-5 bg-[#0D121F] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Physiological Digital Twin</span>
                <span className="text-slate-500 font-normal">·</span>
                <span className="text-xs text-cyan-400 font-mono">ID: SUBJ-082</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time biological sensor projection</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">SQI</span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  sample.signalQualityIndex >= 80
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {sample.signalQualityIndex}%
              </span>
            </div>
          </div>

          {/* Interactive Biological Schematic */}
          <div className="my-5 relative flex items-center justify-center min-h-[260px]">
            {/* SVG Anatomy Silhouette & Dynamic Organs */}
            <svg viewBox="0 0 300 320" className="w-full max-w-[280px] h-auto drop-shadow-md">
              <defs>
                <radialGradient id="bodyGlow" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#090d16" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heartPulse" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background ambient glow */}
              <circle cx="150" cy="150" r="130" fill="url(#bodyGlow)" />

              {/* Human Stylized Silhouette */}
              {/* Head */}
              <circle cx="150" cy="45" r="24" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              {/* Neck & Torso */}
              <path
                d="M138 68 L162 68 L185 92 L205 170 L195 240 L168 250 L150 250 L132 250 L105 240 L95 170 L115 92 Z"
                fill="#111827"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Arms */}
              <path d="M95 105 L65 170 L55 230" fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
              <path d="M205 105 L235 170 L245 230" fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" />

              {/* Lungs (Sinusoidal Expansion) */}
              <g
                transform={`translate(150, 115) scale(${1 + sample.respirationPhase * 0.08}) translate(-150, -115)`}
                opacity={0.7}
              >
                {/* Left Lung */}
                <path d="M125 100 C110 100 112 140 128 145 C136 142 136 102 125 100 Z" fill="#0284c7" />
                {/* Right Lung */}
                <path d="M175 100 C190 100 188 140 172 145 C164 142 164 102 175 100 Z" fill="#0284c7" />
              </g>

              {/* Heart (Pulsing in sync with cardiac rhythm) */}
              <g transform="translate(142, 120)">
                <circle
                  cx="0"
                  cy="0"
                  r={8 + (sample.ecgVoltage > 0.5 ? 4 : 0)}
                  fill="url(#heartPulse)"
                  className="transition-all duration-75"
                />
                <circle cx="0" cy="0" r="4.5" fill="#f43f5e" />
              </g>

              {/* Wrist Wearable Sensor on Left Wrist (x=55, y=230) */}
              <g transform="translate(55, 225)">
                <rect x="-8" y="-5" width="16" height="10" rx="3" fill="#06b6d4" stroke="#e2e8f0" strokeWidth="1" />
                {/* Optical sensor light beam */}
                <circle cx="0" cy="0" r="2.5" fill={sample.signalQualityIndex > 50 ? '#10b981' : '#f43f5e'} />
                {/* Telemetry line connecting to dashboard */}
                <path d="M-8 0 L-25 -20" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,2" />
                <text x="-30" y="-24" fill="#06b6d4" fontSize="9" fontFamily="monospace">PPG/EDA</text>
              </g>

              {/* Skin Conductance Sweat Gland Nodes (represented as small micro-droplets on forehead & palms) */}
              {sample.edaTotal > 6 && (
                <g fill="#06b6d4" opacity="0.8">
                  <circle cx="145" cy="38" r="1.5" />
                  <circle cx="155" cy="40" r="1.5" />
                  <circle cx="245" cy="235" r="2" />
                  <circle cx="55" cy="235" r="2" />
                </g>
              )}
            </svg>

            {/* Float Overlay Annotations */}
            <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[11px] font-mono space-y-1">
              <div className="text-slate-400">THERMAL STATE</div>
              <div className="text-slate-200 font-bold">{sample.skinTemperature.toFixed(1)} °C</div>
              <div className="text-[10px] text-slate-500">
                {sample.skinTemperature > 34 ? 'Vasodilation (Heat dissipation)' : sample.skinTemperature < 31 ? 'Vasoconstriction (Stress/Freeze)' : 'Thermoregulation nominal'}
              </div>
            </div>

            <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[11px] font-mono space-y-1">
              <div className="text-slate-400">LOCOMOTION ACCEL</div>
              <div className="text-slate-200 font-bold">{sample.motionActivity.toFixed(2)} g</div>
              <div className="text-[10px] text-slate-500">
                {sample.motionActivity > 0.8 ? 'Rhythmic Exertion' : sample.motionActivity > 0.15 ? 'Minor Agitation' : 'Stationary / Immobility'}
              </div>
            </div>
          </div>

          {/* Autonomic Nervous System Sympathetic vs Parasympathetic Gauge */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-rose-400 flex items-center gap-1">
                <span>Sympathetic (SAM/Arousal)</span>
                <span className="text-slate-500">{Math.round(autonomicBalanceRatio)}%</span>
              </span>
              <span className="text-cyan-400 flex items-center gap-1">
                <span className="text-slate-500">{Math.round(100 - autonomicBalanceRatio)}%</span>
                <span>Parasympathetic (Vagal Brake)</span>
              </span>
            </div>
            {/* Split Progress Bar */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="bg-rose-500 transition-all duration-300"
                style={{ width: `${autonomicBalanceRatio}%` }}
              />
              <div
                className="bg-cyan-500 transition-all duration-300"
                style={{ width: `${100 - autonomicBalanceRatio}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
              <span>Fight / Flight / Exertion</span>
              <span>Rest / Digest / Recovery</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Precision Multi-Signal Telemetry Matrix */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Signal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Heart Rate */}
            <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5" title="Heart Rate: Number of cardiac contractions per minute. Updates on a calm ~1s wearable window.">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                  Heart Rate
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Beats / Min
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-slate-100 tabular-nums">
                  {sample.displayHeartRate}
                </span>
                <span className="text-xs font-mono uppercase text-slate-500">BPM</span>
                <span className="text-[11px] text-slate-500 ml-auto font-mono">
                  Δ {sample.displayHeartRate > 70 ? `+${sample.displayHeartRate - 70}` : sample.displayHeartRate - 70}
                </span>
              </div>
              {/* Mini Sparkline */}
              <div className="h-10 w-full overflow-hidden">
                <svg viewBox="0 0 160 50" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.8"
                    points={hrSparklinePoints}
                  />
                </svg>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-800/80">
                <span>Resting baseline: 68-72</span>
                <span className={sample.displayHeartRate > 110 ? 'text-amber-400 font-medium' : sample.displayHeartRate < 55 ? 'text-indigo-400 font-medium' : 'text-slate-400'}>
                  {sample.displayHeartRate > 120 ? 'Tachycardia (High)' : sample.displayHeartRate < 55 ? 'Bradycardia (Freeze)' : 'Nominal'}
                </span>
              </div>
            </div>

            {/* Card 2: HRV RMSSD */}
            <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5" title="HRV RMSSD: Heart Rate Variability (Root Mean Square of Successive Differences). High = flexible calm nervous system; Low = stressed or exhausted system.">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  HRV RMSSD (Vagal Brake)
                </span>
                <span className="font-mono text-[11px] text-cyan-400" title="Vagus nerve parasympathetic brake">
                  Autonomic Tone
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-slate-100 tabular-nums">
                  {sample.displayHrvRmssd.toFixed(1)}
                </span>
                <span className="text-xs font-mono uppercase text-slate-500">MS</span>
                <span className="text-[10px] text-slate-500 ml-auto font-mono">
                  Beat-to-beat variability
                </span>
              </div>
              {/* Visual Meter Bar */}
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    sample.displayHrvRmssd < 20
                      ? 'bg-rose-500'
                      : sample.displayHrvRmssd < 35
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (sample.displayHrvRmssd / 70) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-2">
                <span>Healthy reserve: &gt;45 ms</span>
                <span className={sample.displayHrvRmssd < 20 ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                  {sample.displayHrvRmssd < 18 ? 'Vagal Suppression (Stressed)' : sample.displayHrvRmssd > 50 ? 'Strong Vagal Brake (Calm)' : 'Moderate'}
                </span>
              </div>
            </div>

            {/* Card 3: EDA (Electrodermal Activity / GSR) */}
            <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5" title="EDA: Electrodermal Activity (Skin Conductance). Measures microscopic sweat produced by sympathetic nervous activation.">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  EDA Total (Skin Sweat)
                </span>
                <span className="font-mono text-[11px] text-amber-400" title="Sympathetic Nervous Sweat Glands">
                  Micro-Siemens
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-slate-100 tabular-nums">
                  {sample.displayEda.toFixed(2)}
                </span>
                <span className="text-xs font-mono uppercase text-slate-500">µS</span>
                <span className="text-[10px] text-slate-500 ml-auto font-mono">
                  Skin conductance
                </span>
              </div>
              {/* Tonic vs Phasic Breakdown */}
              <div className="space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span title="Tonic SCL: Baseline skin conductance level">Tonic (Base): {sample.edaTonic.toFixed(1)} µS</span>
                  <span title="Phasic SCR: Spontaneous emotional burst or wave">Phasic (Burst): {sample.edaPhasic.toFixed(1)} µS</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  <div
                    className="bg-amber-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, (sample.edaTonic / 15) * 100)}%` }}
                  />
                  <div
                    className="bg-amber-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (sample.edaPhasic / 8) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                {sample.displayEda > 9
                  ? 'Elevated sweat conductance (Arousal / Exertion)'
                  : sample.displayEda < 2
                  ? 'Depressed sweat conductance (Freeze or Cold)'
                  : 'Normal tonic tone'}
              </div>
            </div>

            {/* Card 4: Respiration Rate & Wave */}
            <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5" title="Respiration Rate: Inhalation/exhalation cycles per minute from thoracic expansion.">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  Respiration Rate
                </span>
                <span className="font-mono text-[11px] text-sky-400">
                  Breathing Cadence
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-slate-100 tabular-nums">
                  {sample.displayRespiration}
                </span>
                <span className="text-xs font-mono uppercase text-slate-500">BrPM</span>
                <span className="text-[10px] text-slate-500 ml-auto font-mono">
                  Breaths / min
                </span>
              </div>
              {/* Breathing Waveform */}
              <div className="h-10 w-full overflow-hidden">
                <svg viewBox="0 0 160 50" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    points={respWavePoints}
                  />
                </svg>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-800/80">
                <span>Resting: 12-16 BrPM</span>
                <span className={sample.displayRespiration > 24 ? 'text-amber-400 font-medium' : sample.displayRespiration < 10 ? 'text-indigo-400 font-medium' : 'text-slate-400'}>
                  {sample.displayRespiration > 24 ? 'Tachypnea (Rapid)' : sample.displayRespiration < 10 ? 'Hypoventilation (Freeze)' : 'Eupnea (Normal)'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Multi-Signal Pattern Recognition Bar (How we form patterns from data) */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 mt-1 sm:mt-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Active Multi-Signal Pattern:</span>
                  <span className="text-xs font-bold text-cyan-300">{sample.activePatternName}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{sample.activePatternExplanation}</p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0 self-start sm:self-auto">
              Multi-Sensor Fusion Active
            </div>
          </div>

          {/* Quick Interaction & Trigger Panel */}
          <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              <span className="font-semibold text-slate-200">Interactive Physiological Injections:</span>
              <p className="text-slate-400 mt-0.5">Test how the dual models react to sudden real-time perturbations.</p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={onInjectStressor}
                title="Simulates an acute psychological shock or alarming event without physical motion"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-colors cursor-pointer"
              >
                + Inject Stress Spike
              </button>
              <button
                onClick={onInjectRelaxation}
                title="Simulates deep diaphragmatic breathing (4-7-8) activating the parasympathetic vagal brake"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors cursor-pointer"
              >
                + Deep Breath Recovery
              </button>
              <button
                onClick={onOpenCheckin}
                title="Opens the wearable wristband Ecological Momentary Assessment (EMA) prompt"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Prompt Wristband Check-In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subjective Reality vs Physiological Reality Comparison Strip */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Separation of Measured Physiology vs Subjective State (The Missing Dimension)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrating why wearable stress systems must never conflate physiological arousal with emotional overload.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-800 rounded text-cyan-300">
            {threeDModel.dimension3SelfReport.congruenceWithPhysiology}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
          {/* Dimension 1 */}
          <div className="space-y-1.5">
            <div className="text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              1. Measured Physiology
            </div>
            <div className="text-slate-200 text-base font-bold font-mono">
              Activation: {threeDModel.dimension1Activation.normalizedScore} / 100
            </div>
            <p className="text-slate-400 leading-relaxed">
              Context baseline adjusted for motion ({sample.motionActivity.toFixed(1)}g) & caffeine ({context.caffeineIntakeMg}mg).
              Category: <span className="text-slate-200 font-semibold">{threeDModel.dimension1Activation.category}</span>.
            </p>
          </div>

          {/* Dimension 2 */}
          <div className="space-y-1.5">
            <div className="text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              2. Persistence & Recovery
            </div>
            <div className="text-slate-200 text-base font-bold font-mono">
              Trajectory: {threeDModel.dimension2Persistence.trajectoryStatus.replace('_', ' ')}
            </div>
            <p className="text-slate-400 leading-relaxed">
              Recovery slope: <span className="font-mono text-slate-200">{threeDModel.dimension2Persistence.recoverySlopeBpmPerMin} bpm/min</span>.
              Allostatic decay: <span className="font-mono text-slate-200">{threeDModel.dimension2Persistence.allostaticDecayRate}x</span>.
            </p>
          </div>

          {/* Dimension 3 */}
          <div className="space-y-1.5">
            <div className="text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              3. Self-Reported Readiness
            </div>
            <div className="text-slate-200 text-base font-bold font-mono">
              Distress: {context.subjectReportedDistress} / 10 · Readiness: {context.subjectReportedReadiness} / 10
            </div>
            <p className="text-slate-400 leading-relaxed">
              Agency preference: <span className="text-cyan-400 font-mono">{context.subjectPrivacyPreference}</span>.
              Perceived control is respected above raw automated sensor triggers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { PhysiologicalSample } from '../types/simulator';
import { SEVEN_DAY_LONGITUDINAL_HISTORY, DailyAutonomicRecord } from '../data/longitudinalData';
import { Play, Pause, AlertTriangle, Wind, Footprints, ShieldAlert, Calendar, Activity, TrendingUp, Moon, Coffee, Heart } from 'lucide-react';

interface WaveformInspectorProps {
  samples: PhysiologicalSample[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSetSpeed: (s: number) => void;
  onInjectStressor: () => void;
  onInjectExercise: () => void;
  onInjectRelaxation: () => void;
  onToggleLooseSensor: () => void;
  isSensorLoose: boolean;
}

export const WaveformInspector: React.FC<WaveformInspectorProps> = ({
  samples,
  isPlaying,
  onTogglePlay,
  speed,
  onSetSpeed,
  onInjectStressor,
  onInjectExercise,
  onInjectRelaxation,
  onToggleLooseSensor,
  isSensorLoose,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'realtime' | 'longitudinal'>('realtime');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(4); // Default to Friday (Allostatic Overload peak)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeViewMode !== 'realtime') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, height);

    // Draw background grid lines (medical monitor style)
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 4 channel layout:
    // Ch 1: ECG / Cardiac Pulse
    // Ch 2: EDA Skin Conductance
    // Ch 3: Respiration
    // Ch 4: Accelerometer
    const channels = [
      { name: 'CH 1: ECG / Cardiac Pulse Wave (mV)', color: '#f43f5e', yBase: 50, scale: 28 },
      { name: 'CH 2: Electrodermal Activity EDA (µS)', color: '#f59e0b', yBase: 130, scale: 3.5 },
      { name: 'CH 3: Respiration Cadence (BrPM)', color: '#06b6d4', yBase: 205, scale: 22 },
      { name: 'CH 4: 3-Axis Accelerometer (g)', color: '#10b981', yBase: 275, scale: 18 },
    ];

    ctx.font = '10px "JetBrains Mono", monospace';
    channels.forEach((ch, idx) => {
      ctx.fillStyle = '#475569';
      ctx.fillText(ch.name, 12, ch.yBase - 32);

      if (idx > 0) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const divY = idx === 1 ? 90 : idx === 2 ? 170 : 240;
        ctx.moveTo(0, divY);
        ctx.lineTo(width, divY);
        ctx.stroke();
      }
    });

    if (samples.length < 2) return;

    const maxPoints = Math.min(samples.length, 250);
    const recent = samples.slice(-maxPoints);

    // Ch 1: ECG
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    recent.forEach((s, i) => {
      const x = (i / (maxPoints - 1)) * (width - 24) + 12;
      const y = channels[0].yBase - s.ecgVoltage * channels[0].scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Ch 2: EDA
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    recent.forEach((s, i) => {
      const x = (i / (maxPoints - 1)) * (width - 24) + 12;
      const y = channels[1].yBase - (s.edaTotal - 2) * channels[1].scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Ch 3: Respiration
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    recent.forEach((s, i) => {
      const x = (i / (maxPoints - 1)) * (width - 24) + 12;
      const y = channels[2].yBase - s.respirationPhase * channels[2].scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Ch 4: Accelerometer
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    recent.forEach((s, i) => {
      const x = (i / (maxPoints - 1)) * (width - 24) + 12;
      const y = channels[3].yBase - s.motionActivity * channels[3].scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Sweep cursor
    const latestX = width - 12;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(latestX, 0);
    ctx.lineTo(latestX, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [samples, activeViewMode]);

  const latestSample = samples[samples.length - 1];
  const selectedDayRecord = SEVEN_DAY_LONGITUDINAL_HISTORY[selectedDayIndex];

  // SVG Coordinates for 7-Day Chart (7 points across width 800, height 180)
  const chartWidth = 800;
  const chartHeight = 170;
  const paddingX = 40;
  const stepX = (chartWidth - paddingX * 2) / 6;

  // Resting HR: scale 55 - 90 BPM
  const hrPoints = SEVEN_DAY_LONGITUDINAL_HISTORY.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = chartHeight - ((d.restingHrBpm - 55) / 35) * (chartHeight - 30) - 15;
    return { x, y, val: d.restingHrBpm };
  });

  // Nightly HRV RMSSD: scale 10 - 75 ms
  const hrvPoints = SEVEN_DAY_LONGITUDINAL_HISTORY.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = chartHeight - ((d.nightlyHrvRmssd - 10) / 65) * (chartHeight - 30) - 15;
    return { x, y, val: d.nightlyHrvRmssd };
  });

  // Allostatic load: scale 0 - 100%
  const loadPoints = SEVEN_DAY_LONGITUDINAL_HISTORY.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = chartHeight - (d.allostaticLoadScore / 100) * (chartHeight - 30) - 15;
    return { x, y, val: d.allostaticLoadScore };
  });

  return (
    <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Top Header & Dual-Scale Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Autonomic Telemetry Inspection</span>
            <span className="text-slate-500 font-normal">·</span>
            <span className="text-xs text-slate-400 font-mono">Micro (Seconds) vs Macro (1 Week)</span>
          </h3>
        </div>

        {/* View Switcher: Seconds vs 1-Week */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveViewMode('realtime')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeViewMode === 'realtime'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Strip (Seconds)</span>
            </button>
            <button
              onClick={() => setActiveViewMode('longitudinal')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeViewMode === 'longitudinal'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>7-Day Longitudinal Trend (1 Week)</span>
            </button>
          </div>

          {activeViewMode === 'realtime' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePlay}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>

              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => onSetSpeed(s)}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      speed === s ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW A: REAL-TIME 10 Hz STRIP CHART */}
      {activeViewMode === 'realtime' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Canvas Viewport */}
          <div className="relative rounded-lg overflow-hidden border border-slate-800/80 bg-[#080c14]">
            <canvas
              ref={canvasRef}
              width={900}
              height={310}
              className="w-full h-[300px] block cursor-crosshair"
            />

            {latestSample && (
              <div className="absolute top-2 right-3 bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono flex items-center gap-3 text-slate-300">
                <span>T+ {latestSample.timestamp.toFixed(1)}s</span>
                <span>HR: {latestSample.displayHeartRate}</span>
                <span>EDA: {latestSample.displayEda.toFixed(2)}µS</span>
                <span>Motion: {latestSample.displayMotion.toFixed(2)}g</span>
              </div>
            )}
          </div>

          {/* Aim of the Strip Chart & Chronological Coincidence Box */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-200 font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>What is the Practical Aim of the Real-Time Strip Chart?</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">CHRONOLOGICAL COINCIDENCE DETECTION</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              When looking at a static number like "HR 130", you cannot tell <em>why</em> it spiked.
              The strip chart shows the exact <strong>chronological sequence of events</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px] text-slate-300">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80">
                <span className="text-emerald-400 font-semibold">1. Did Motion Lead the Spike?</span>
                <p className="text-slate-400 mt-0.5">
                  If the green accelerometer channel jumps <em>first</em>, followed 2 seconds later by heart rate and sweat, it is verified <strong>physical movement</strong> (stairs, exercise).
                </p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80">
                <span className="text-rose-400 font-semibold">2. Did Arousal Spike While Still?</span>
                <p className="text-slate-400 mt-0.5">
                  If heart rate and sweat shoot straight up while the green motion line stays completely flat at zero, it is verified <strong>non-motion autonomic hyperarousal</strong> (acute panic or emotional stress).
                </p>
              </div>
            </div>
          </div>

          {/* Real-Time Perturbation Toolbar */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Inject Real-Time Event:</span>
              <button
                onClick={onInjectStressor}
                className="px-2.5 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Acute Stressor Spike</span>
              </button>
              <button
                onClick={onInjectExercise}
                className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Climb 3 Flights of Stairs</span>
              </button>
              <button
                onClick={onInjectRelaxation}
                className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Vagal Rebound (Deep Breath)</span>
              </button>
              <button
                onClick={onToggleLooseSensor}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSensorLoose
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isSensorLoose ? 'Fix Wristband Fit' : 'Loosen Wristband (Artifact)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: 7-DAY LONGITUDINAL TREND (1 WEEK MACRO VIEW) */}
      {activeViewMode === 'longitudinal' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Header Explanation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>7-Day Longitudinal Autonomic Profile (Sarah M. · Subject #082)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                How acute daily stress events accumulate into 1-week baseline drift, sleep deficit, and allostatic overload.
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Resting HR (BPM)
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Nightly HRV (ms)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Allostatic Load (%)
              </span>
            </div>
          </div>

          {/* SVG 7-Day Longitudinal Graph */}
          <div className="bg-[#080c14] border border-slate-800 rounded-lg p-4 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-[200px] overflow-visible">
              {/* Horizontal guideline levels */}
              <line x1={paddingX} y1={30} x2={chartWidth - paddingX} y2={30} stroke="#1e293b" strokeDasharray="3,3" />
              <line x1={paddingX} y1={90} x2={chartWidth - paddingX} y2={90} stroke="#1e293b" strokeDasharray="3,3" />
              <line x1={paddingX} y1={150} x2={chartWidth - paddingX} y2={150} stroke="#1e293b" strokeDasharray="3,3" />

              {/* Day vertical grid columns */}
              {SEVEN_DAY_LONGITUDINAL_HISTORY.map((d, i) => {
                const x = paddingX + i * stepX;
                const isSelected = i === selectedDayIndex;
                return (
                  <g key={d.dayName} onClick={() => setSelectedDayIndex(i)} className="cursor-pointer">
                    {/* Hover column background */}
                    <rect
                      x={x - stepX / 2}
                      y={0}
                      width={stepX}
                      height={chartHeight}
                      fill={isSelected ? '#06b6d4' : 'transparent'}
                      opacity={isSelected ? 0.08 : 0}
                    />
                    {/* Day label */}
                    <text
                      x={x}
                      y={chartHeight + 18}
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : '#64748b'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {d.shortDay}
                    </text>
                  </g>
                );
              })}

              {/* Curve 1: Resting Heart Rate (Rose) */}
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                points={hrPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              />
              {hrPoints.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={idx === selectedDayIndex ? 5 : 3.5}
                  fill="#f43f5e"
                  stroke="#080c14"
                  strokeWidth="2"
                />
              ))}

              {/* Curve 2: Nightly HRV RMSSD (Cyan) */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                points={hrvPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              />
              {hrvPoints.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={idx === selectedDayIndex ? 5 : 3.5}
                  fill="#06b6d4"
                  stroke="#080c14"
                  strokeWidth="2"
                />
              ))}

              {/* Curve 3: Allostatic Load Score (Amber) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4,3"
                points={loadPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              />
            </svg>
          </div>

          {/* 7-Day Day Selector Buttons Strip */}
          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {SEVEN_DAY_LONGITUDINAL_HISTORY.map((day, idx) => {
              const isSelected = idx === selectedDayIndex;
              return (
                <button
                  key={day.dayName}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold">{day.shortDay}</span>
                    <span className="text-[10px] text-slate-500">{day.dateLabel}</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-200 mt-1">
                    {day.restingHrBpm} <span className="text-[9px] font-normal text-slate-400">BPM</span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">
                    {day.nightlyHrvRmssd} <span className="text-[9px] text-slate-500">ms</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Deep Dive Card */}
          {selectedDayRecord && (
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <div className="text-[10px] font-mono uppercase text-cyan-400">
                    Day Inspection: {selectedDayRecord.dayName} ({selectedDayRecord.dateLabel})
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                    <span>Autonomic Classification:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                      selectedDayRecord.autonomicState === 'Optimal Resilience'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : selectedDayRecord.autonomicState === 'Autonomic Exhaustion'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {selectedDayRecord.autonomicState}
                    </span>
                  </h4>
                </div>
                <div className="text-xs text-slate-300 font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                  Allostatic Load: <span className="font-bold text-amber-400">{selectedDayRecord.allostaticLoadScore}%</span>
                </div>
              </div>

              {/* Day Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    Resting Baseline
                  </span>
                  <div className="text-base font-bold text-slate-100 font-mono">
                    {selectedDayRecord.restingHrBpm} <span className="text-xs font-normal text-slate-400">BPM</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedDayRecord.restingHrBpm > 70 ? `+${selectedDayRecord.restingHrBpm - 64} bpm drift vs Mon` : 'Nominal baseline'}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    Nightly HRV RMSSD
                  </span>
                  <div className="text-base font-bold text-slate-100 font-mono">
                    {selectedDayRecord.nightlyHrvRmssd} <span className="text-xs font-normal text-slate-400">MS</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedDayRecord.nightlyHrvRmssd < 25 ? 'Depleted parasympathetic reserve' : 'Strong vagal recovery'}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                    <Moon className="w-3 h-3 text-indigo-400" />
                    Sleep Duration
                  </span>
                  <div className="text-base font-bold text-slate-100 font-mono">
                    {selectedDayRecord.sleepHours} <span className="text-xs font-normal text-slate-400">HRS</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Quality score: {selectedDayRecord.sleepQualityPercent}%
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-amber-400" />
                    Recovery Half-Life
                  </span>
                  <div className="text-base font-bold text-slate-100 font-mono">
                    {selectedDayRecord.avgRecoveryMinutes} <span className="text-xs font-normal text-slate-400">MIN</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedDayRecord.triggersCount} triggers logged
                  </div>
                </div>
              </div>

              {/* Clinical Narrative for Selected Day */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
                <span className="font-semibold text-cyan-300">Clinical Narrative:</span>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  {selectedDayRecord.clinicalSummary}
                </p>
              </div>
            </div>
          )}

          {/* Why Looking Across 1 Week is Crucial */}
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs space-y-1">
            <span className="font-bold text-cyan-300">Why Looking Across 7 Days is Clinically Essential:</span>
            <p className="text-slate-300 leading-relaxed">
              In a single moment, heart rate only tells you if you are aroused. But across 7 days, the data reveals
              <strong> Baseline Drift</strong> and <strong>Allostatic Load</strong>. Notice how from Monday to Friday:
              resting heart rate drifted from 64 to 83 BPM (+19 BPM), sleep dropped from 8.2h to 4.8h, and recovery took 9x longer (2.1 min $\rightarrow$ 19.5 min).
              A fixed-baseline model recalculating every morning normalizes this exhaustion as "just another day." The 3D model compares it against true unburdened historical norms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

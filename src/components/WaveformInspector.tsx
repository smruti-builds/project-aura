import React, { useEffect, useRef } from 'react';
import { PhysiologicalSample } from '../types/simulator';
import { Play, Pause, FastForward, RotateCcw, AlertTriangle, Wind, Footprints, ShieldAlert } from 'lucide-react';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
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
    // Ch 1: ECG / Tachogram (y: 0 to 90)
    // Ch 2: EDA (y: 90 to 170)
    // Ch 3: Respiration (y: 170 to 240)
    // Ch 4: Accelerometer (y: 240 to 300)
    const channels = [
      { name: 'CH 1: ECG / Cardiac Pulse (mV)', color: '#f43f5e', yBase: 50, scale: 28 },
      { name: 'CH 2: Electrodermal Activity EDA (µS)', color: '#f59e0b', yBase: 130, scale: 3.5 },
      { name: 'CH 3: Respiration Cycle (BrPM)', color: '#06b6d4', yBase: 205, scale: 22 },
      { name: 'CH 4: 3-Axis Accelerometer (g)', color: '#10b981', yBase: 275, scale: 18 },
    ];

    // Draw horizontal channel dividers & labels
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

    // Render Ch 1: ECG waveform
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

    // Render Ch 2: EDA waveform
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

    // Render Ch 3: Respiration waveform
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

    // Render Ch 4: Accelerometer Motion
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

    // Sweep bar / latest cursor
    const latestX = width - 12;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(latestX, 0);
    ctx.lineTo(latestX, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [samples]);

  const latestSample = samples[samples.length - 1];

  return (
    <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Waveform Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Multi-Channel Physiological Strip Chart</span>
            <span className="text-slate-500 font-normal">·</span>
            <span className="text-xs text-slate-400 font-mono">10 Hz Telemetry</span>
          </h3>
        </div>

        {/* Playback Controls & Speed Multipliers */}
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
      </div>

      {/* Real-Time Canvas Viewport */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800/80 bg-[#080c14]">
        <canvas
          ref={canvasRef}
          width={900}
          height={310}
          className="w-full h-[300px] block cursor-crosshair"
        />

        {/* HUD Overlay in bottom right */}
        {latestSample && (
          <div className="absolute top-2 right-3 bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono flex items-center gap-3 text-slate-300">
            <span>T+ {latestSample.timestamp.toFixed(1)}s</span>
            <span>HR: {latestSample.heartRate.toFixed(0)}</span>
            <span>EDA: {latestSample.edaTotal.toFixed(2)}µS</span>
            <span>Motion: {latestSample.motionActivity.toFixed(2)}g</span>
          </div>
        )}
      </div>

      {/* Real-Time Perturbation Toolbar */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
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
  );
};

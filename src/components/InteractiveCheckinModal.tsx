import React, { useState } from 'react';
import { ThreeDimensionalModelStatus, StagePipelineStatus } from '../types/simulator';
import { X, Check, BellOff, Heart, Wind, ShieldAlert, Sparkles } from 'lucide-react';

interface InteractiveCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  threeDModel: ThreeDimensionalModelStatus;
  stagePipeline: StagePipelineStatus;
  onSubmitFeedback: (distress: number, readiness: number, isExertion: boolean) => void;
}

export const InteractiveCheckinModal: React.FC<InteractiveCheckinModalProps> = ({
  isOpen,
  onClose,
  threeDModel,
  stagePipeline,
  onSubmitFeedback,
}) => {
  const [viewMode, setViewMode] = useState<'calibrated' | 'naive'>('calibrated');
  const [selectedDistress, setSelectedDistress] = useState<number>(threeDModel.dimension3SelfReport.reportedDistress);
  const [selectedReadiness, setSelectedReadiness] = useState<number>(threeDModel.dimension3SelfReport.reportedReadiness);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0D121F] border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#090D16]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Wearable Interaction Simulator (On-Wrist Experience)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher: Compare Naive Alert vs Calibrated Check-in */}
        <div className="px-5 pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Render Intervention As:</span>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1 text-xs">
            <button
              onClick={() => setViewMode('calibrated')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                viewMode === 'calibrated'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3D Adaptive Check-in
            </button>
            <button
              onClick={() => setViewMode('naive')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                viewMode === 'naive'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Naive 4-Stage Siren
            </button>
          </div>
        </div>

        {/* Smartwatch Screen Container */}
        <div className="p-5 flex justify-center">
          {/* Smartwatch Frame */}
          <div className="w-[300px] rounded-3xl p-5 border-4 border-slate-700 bg-black text-slate-100 shadow-inner flex flex-col justify-between min-h-[360px]">
            {viewMode === 'naive' ? (
              /* Naive Intrusive Alert */
              <div className="space-y-4 text-center my-auto">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500 animate-pulse">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-rose-400">PANIC DETECTED!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Your heart rate is 134 BPM. You have triggered 3 stress events in 30 minutes!
                  </p>
                </div>
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-[11px] text-rose-300 text-left">
                  <p className="font-semibold">Mandatory Protocol:</p>
                  <p className="mt-0.5">Stop what you are doing immediately and start emergency deep breathing.</p>
                </div>
                <div className="space-y-2 pt-2">
                  <button className="w-full py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition-colors">
                    Start Guided Breathing (4 Min)
                  </button>
                  <button className="w-full py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                    Notify Emergency Contact
                  </button>
                </div>
                <p className="text-[10px] text-rose-400/80 italic pt-1">
                  Flaw: If user is running or on stairs, this is humiliating and causes alarm fatigue.
                </p>
              </div>
            ) : (
              /* Calibrated 3D Human-Centric Prompt */
              <div className="space-y-3.5 my-auto text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AURA Check-In</span>
                  </div>
                  <span className="text-[10px] text-slate-500">1-Tap Dismiss</span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    Physiological Arousal Detected
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Elevated activation recorded without verified locomotion. How are you feeling right now?
                  </p>
                </div>

                {/* Distress Slider / Toggles */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Distress Level:</span>
                    <span className="font-bold text-cyan-300 font-mono">{selectedDistress} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={selectedDistress}
                    onChange={(e) => setSelectedDistress(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0: Fine / Working</span>
                    <span>10: Overwhelmed</span>
                  </div>
                </div>

                {/* Quick 1-Tap Action Chips */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      onSubmitFeedback(0, 9, true);
                      onClose();
                    }}
                    className="py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] font-medium text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    It's Exercise / Stairs
                  </button>
                  <button
                    onClick={() => {
                      onSubmitFeedback(1, 8, false);
                      onClose();
                    }}
                    className="py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] font-medium text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    I'm Focused / OK
                  </button>
                  <button
                    onClick={() => {
                      onSubmitFeedback(8, 2, false);
                      onClose();
                    }}
                    className="py-1.5 px-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 rounded-lg text-[11px] font-medium text-rose-300 transition-colors cursor-pointer text-center"
                  >
                    Need a Minute
                  </button>
                  <button
                    onClick={onClose}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-400 transition-colors cursor-pointer text-center"
                  >
                    Dismiss Quietly
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Explanation */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] text-xs text-slate-400 flex items-center justify-between">
          <span>Clinical Principle: Respect user dignity, autonomy, and dismissal agency.</span>
          <button
            onClick={() => {
              onSubmitFeedback(selectedDistress, selectedReadiness, false);
              onClose();
            }}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium cursor-pointer transition-colors"
          >
            Save Subject State
          </button>
        </div>
      </div>
    </div>
  );
};

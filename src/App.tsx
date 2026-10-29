/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ModeSelectorBar } from './components/ModeSelectorBar';
import { DigitalTwinEyeView } from './components/DigitalTwinEyeView';
import { PipelineComparisonView } from './components/PipelineComparisonView';
import { BenchmarkSuiteView } from './components/BenchmarkSuiteView';
import { ClinicalWhitepaperView } from './components/ClinicalWhitepaperView';
import { WaveformInspector } from './components/WaveformInspector';
import { InteractiveCheckinModal } from './components/InteractiveCheckinModal';
import { GitHubPagesModal } from './components/GitHubPagesModal';
import { SIMULATION_PRESETS } from './data/simulationPresets';
import { WearableSimulationEngine } from './engine/simulationEngine';
import {
  PhysiologicalSample,
  SimulationContext,
  SimulationModeId,
  StagePipelineStatus,
  ThreeDimensionalModelStatus,
} from './types/simulator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'twin_eye' | 'pipeline_compare' | 'benchmarks' | 'whitepaper'>('twin_eye');
  const [currentModeId, setCurrentModeId] = useState<SimulationModeId>('resting_baseline');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // Engine instance initialized with initial preset
  const engineRef = useRef<WearableSimulationEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new WearableSimulationEngine(SIMULATION_PRESETS[0]);
  }
  const engine = engineRef.current;

  // React state reflecting the engine's current outputs
  const [currentSample, setCurrentSample] = useState<PhysiologicalSample>(() => {
    return engine.step(0.1).sample;
  });
  const [stagePipeline, setStagePipeline] = useState<StagePipelineStatus>(() => {
    return engine.step(0.1).stagePipeline;
  });
  const [threeDModel, setThreeDModel] = useState<ThreeDimensionalModelStatus>(() => {
    return engine.step(0.1).threeDModel;
  });
  const [context, setContext] = useState<SimulationContext>(() => engine.getContext());
  const [history, setHistory] = useState<PhysiologicalSample[]>(() => engine.getHistory());

  // Simulation tick loop (runs at 10Hz)
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.round(100 / speed);
    const interval = setInterval(() => {
      if (!engineRef.current) return;
      const { sample, stagePipeline: stage, threeDModel: threeD } = engineRef.current.step(0.1);
      setCurrentSample(sample);
      setStagePipeline(stage);
      setThreeDModel(threeD);
      setContext(engineRef.current.getContext());
      setHistory(engineRef.current.getHistory());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Mode Selection handler
  const handleSelectMode = useCallback((modeId: SimulationModeId) => {
    setCurrentModeId(modeId);
    const targetPreset = SIMULATION_PRESETS.find((p) => p.id === modeId) || SIMULATION_PRESETS[0];
    if (engineRef.current) {
      engineRef.current.setPreset(targetPreset);
      const { sample, stagePipeline: stage, threeDModel: threeD } = engineRef.current.step(0.1);
      setCurrentSample(sample);
      setStagePipeline(stage);
      setThreeDModel(threeD);
      setContext(engineRef.current.getContext());
      setHistory(engineRef.current.getHistory());
    }
  }, []);

  // Context updates
  const handleUpdateContext = useCallback((partial: Partial<SimulationContext>) => {
    if (engineRef.current) {
      engineRef.current.updateContext(partial);
      setContext(engineRef.current.getContext());
    }
  }, []);

  // Event Injections
  const handleInjectStressor = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.injectStressor(0.9);
      setContext(engineRef.current.getContext());
    }
  }, []);

  const handleInjectExercise = useCallback(() => {
    handleSelectMode('physical_exercise');
  }, [handleSelectMode]);

  const handleInjectRelaxation = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.injectRelaxation();
      setContext(engineRef.current.getContext());
    }
  }, []);

  const handleToggleLooseSensor = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.toggleSensorFit();
      setContext(engineRef.current.getContext());
    }
  }, []);

  const handleResetSimulation = useCallback(() => {
    handleSelectMode('resting_baseline');
  }, [handleSelectMode]);

  const handleSubmitFeedback = useCallback((distress: number, readiness: number, isExertion: boolean) => {
    if (engineRef.current) {
      if (isExertion) {
        handleSelectMode('physical_exercise');
      } else {
        engineRef.current.updateContext({
          subjectReportedDistress: distress,
          subjectReportedReadiness: readiness,
        });
        setContext(engineRef.current.getContext());
      }
    }
  }, [handleSelectMode]);

  const activePreset = SIMULATION_PRESETS.find((p) => p.id === currentModeId) || SIMULATION_PRESETS[0];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header conforming to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onResetSimulation={handleResetSimulation}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Mode Selector & Context Ribbon */}
      <ModeSelectorBar
        currentModeId={currentModeId}
        onSelectMode={handleSelectMode}
        context={context}
        onUpdateContext={handleUpdateContext}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
        {activeTab === 'twin_eye' && (
          <div className="space-y-6">
            <DigitalTwinEyeView
              sample={currentSample}
              context={context}
              preset={activePreset}
              stagePipeline={stagePipeline}
              threeDModel={threeDModel}
              history={history}
              onOpenCheckin={() => setIsCheckinOpen(true)}
              onInjectStressor={handleInjectStressor}
              onInjectRelaxation={handleInjectRelaxation}
            />
            <WaveformInspector
              samples={history}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              speed={speed}
              onSetSpeed={setSpeed}
              onInjectStressor={handleInjectStressor}
              onInjectExercise={handleInjectExercise}
              onInjectRelaxation={handleInjectRelaxation}
              onToggleLooseSensor={handleToggleLooseSensor}
              isSensorLoose={context.isSensorLoose}
            />
          </div>
        )}

        {activeTab === 'pipeline_compare' && (
          <div className="space-y-6">
            <PipelineComparisonView
              sample={currentSample}
              context={context}
              preset={activePreset}
              stagePipeline={stagePipeline}
              threeDModel={threeDModel}
            />
            <WaveformInspector
              samples={history}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              speed={speed}
              onSetSpeed={setSpeed}
              onInjectStressor={handleInjectStressor}
              onInjectExercise={handleInjectExercise}
              onInjectRelaxation={handleInjectRelaxation}
              onToggleLooseSensor={handleToggleLooseSensor}
              isSensorLoose={context.isSensorLoose}
            />
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarkSuiteView
            onLoadCasePreset={(modeId) => {
              handleSelectMode(modeId);
              setActiveTab('twin_eye');
            }}
          />
        )}

        {activeTab === 'whitepaper' && (
          <ClinicalWhitepaperView />
        )}
      </main>

      {/* Interactive Wristband Modal Simulation */}
      <InteractiveCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        threeDModel={threeDModel}
        stagePipeline={stagePipeline}
        onSubmitFeedback={handleSubmitFeedback}
      />

      {/* GitHub Pages & Portfolio Deployment Modal */}
      <GitHubPagesModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Clean Scientific Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A12] py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium">AURA Wearable Laboratory</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>100% In-Browser Simulation Engine</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Designed for Portfolio & Clinical Psychology Review</span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          Sample Rate: 10 Hz · Mathematical Synthesizer Active
        </div>
      </footer>
    </div>
  );
}

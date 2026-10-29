import React from 'react';
import { BookOpen, CheckCircle, Shield, Award, Sparkles, Terminal } from 'lucide-react';

export const ClinicalWhitepaperView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-300">
      {/* Title & Editorial Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <span>RESEARCH MONOGRAPH</span>
          <span className="text-slate-600">·</span>
          <span>HUMAN-CENTRIC WEARABLE COMPUTING</span>
          <span className="text-slate-600">·</span>
          <span>PORTFOLIO EXHIBIT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          Challenging the Linear Wearable Pipeline: A 3-Dimensional Empirical Framework for Autonomic Stress Detection
        </h1>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          Why current commercial algorithms fail in real life, why arousal does not equal distress, and how grounding
          wearable inference in clinical psychology transforms wearable devices into respectful digital companions.
        </p>
      </div>

      {/* Section 1: The Core Thesis */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm">01.</span>
          <span>The Epistemic Flaw in Commercial Wearables</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Most wearable devices operate on an implicit linear pipeline:
        </p>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-center text-cyan-300">
          Baseline → Trigger Detection → Recovery Check → Overload Alarm
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          This pipeline assumes that a person's autonomic state can be neatly categorized as "calm" or "stressed" based
          on sympathetic activation. In reality, <strong className="text-slate-100">physiological arousal and emotional distress are completely separate dimensions</strong>.
          An elevated heart rate and surges in electrodermal activity (EDA) are observed when climbing stairs, laughing with colleagues,
          giving a confident keynote, or experiencing an acute panic attack. Conflating sympathetic arousal with psychological
          pathology breeds user distrust and alarm fatigue.
        </p>
      </section>

      {/* Section 2: Four Stages and What Goes Wrong */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm">02.</span>
          <span>Deconstructing the 4 Stages: Failure Modes</span>
        </h2>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-4 bg-[#0D121F] border border-slate-800 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-100 text-sm">Stage 1 — Baseline: Is the Baseline Truly Stable?</h3>
            <p className="text-slate-400">
              <strong className="text-slate-300">The Assumption:</strong> A person's normal resting HR, HRV, and EDA are fixed values that can be learned from a 3-day window.
            </p>
            <p className="text-slate-400">
              <strong className="text-slate-300">What Goes Wrong:</strong> Baselines drift with sleep deficit, caffeine, medication, illness, menstrual cycles, and ambient temperature. A person under chronic stress already has an altered baseline.
            </p>
            <p className="text-cyan-400 font-semibold pt-1">
              Clinical Remedy: Learn context-specific baselines (sleeping, seated desk, walking) and track baseline drift rather than enforcing rigid fixed constants.
            </p>
          </div>

          <div className="p-4 bg-[#0D121F] border border-slate-800 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-100 text-sm">Stage 2 — Trigger Response: What Caused the Deviation?</h3>
            <p className="text-slate-400">
              <strong className="text-slate-300">The Assumption:</strong> Any sudden deviation from baseline represents an external psychological stressor.
            </p>
            <p className="text-slate-400">
              <strong className="text-slate-300">What Goes Wrong:</strong> Walking up stairs raises HR and EDA. Heat causes sweat conductance spikes. Conversely, a quiet distressing thought can cause immense internal suffering with minimal wrist vitals change.
            </p>
            <p className="text-cyan-400 font-semibold pt-1">
              Clinical Remedy: Label raw output as "Physiological Arousal Detected", never "Panic Detected", unless validated with accelerometer motion gating and user context.
            </p>
          </div>

          <div className="p-4 bg-[#0D121F] border border-slate-800 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-100 text-sm">Stage 3 — Recovery Check: What Counts as Recovery?</h3>
            <p className="text-slate-400">
              <strong className="text-slate-300">The Assumption:</strong> Once heart rate returns to baseline, the person has recovered.
            </p>
            <p className="text-slate-400">
              <strong className="text-slate-300">What Goes Wrong:</strong> Physiological recovery and emotional recovery operate on vastly different time constants. A person may sit perfectly still while feeling terrified, dissociated, or numb.
            </p>
            <p className="text-cyan-400 font-semibold pt-1">
              Clinical Remedy: Track recovery trajectories (decay slope) and treat physiological recovery and perceived recovery as separate, orthogonal variables.
            </p>
          </div>

          <div className="p-4 bg-[#0D121F] border border-slate-800 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-100 text-sm">Stage 4 — Possible Overload: Does Slow Recovery Mean Overload?</h3>
            <p className="text-slate-400">
              <strong className="text-slate-300">The Assumption:</strong> Multiple triggers plus delayed recovery warrants a high-urgency intervention alarm.
            </p>
            <p className="text-slate-400">
              <strong className="text-slate-300">What Goes Wrong:</strong> Demanding work sprints or intense gaming frequently show repeated spikes without negative health outcomes. An intrusive siren embarrasses users in meetings and breaches trust.
            </p>
            <p className="text-cyan-400 font-semibold pt-1">
              Clinical Remedy: Employ confidence-aware, personalized trajectory scoring with gentle 1-tap dismissible check-ins that respect user privacy and agency.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: The Missing Dimension - Polyvagal Freeze */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm">03.</span>
          <span>The Missing Dimension: Polyvagal Shutdown & Hypo-Arousal</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          The most dangerous blind spot of modern wearables is the assumption that distress is always a state of high arousal.
          Under Stephen Porges' <strong className="text-slate-100">Polyvagal Theory</strong>, when acute fight-or-flight sympathetic response is unavailable or overwhelmed, the unmyelinated dorsal vagal complex can induce a state of <strong className="text-slate-100">freeze, immobility, or dissociation</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400 leading-relaxed">
          <li>Heart rate drops (bradycardia or flat low variability).</li>
          <li>Electrodermal activity is blunted or depressed.</li>
          <li>Accelerometer registers zero motion (behavioral stillness).</li>
        </ul>
        <p className="text-sm text-slate-300 leading-relaxed">
          A naive model observes these low readings and congratulates the user on "entering a deep meditative calm."
          In reality, the subject is in acute traumatic paralysis. A 3-dimensional model that respects self-reported
          state immediately flags this divergence.
        </p>
      </section>

      {/* Section 4: The 3D Parallel Model */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm">04.</span>
          <span>The 3-Dimensional Empirical Parallel Model</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Rather than forcing a user through a rigid 4-stage pipeline, our proposed architecture maintains three
          continuous orthogonal axes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-cyan-400 font-bold font-mono">1. Physiological Activation</div>
            <p className="text-slate-400">
              Normalized distance from context-aware baseline (factoring 3-axis motion, temperature, and caffeine).
            </p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-cyan-400 font-bold font-mono">2. Persistence & Recovery</div>
            <p className="text-slate-400">
              Duration of deviation, half-life decay rate, recurrence frequency, and allostatic accumulation slope.
            </p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-cyan-400 font-bold font-mono">3. Self-Reported Readiness</div>
            <p className="text-slate-400">
              User's perceived distress, coping energy, and explicit privacy preferences (Do Not Disturb vs Open).
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Clinical Psychology Validation Roadmap */}
      <section className="space-y-3 pb-6 border-b border-slate-800">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm">05.</span>
          <span>Clinical Validation Roadmap</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          To build algorithms worthy of user trust:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-400 leading-relaxed">
          <li><strong className="text-slate-200">Establish What Can Be Reliably Measured:</strong> Isolate raw signal quality (SQI) before running inferences. If sensor contact is poor, refuse to guess.</li>
          <li><strong className="text-slate-200">Validate What Can Be Inferred:</strong> Correlate physiological arousal against laboratory stress protocols (Trier Social Stress Test, cold pressor) vs physical exercise controls.</li>
          <li><strong className="text-slate-200">Validate with Clinical Psychologists:</strong> Ensure terminology avoids pathologizing natural bodily responses.</li>
          <li><strong className="text-slate-200">Protect User Autonomy:</strong> Wearables must never shout or judge; they must be unobtrusive, gentle mirrors that empower human self-understanding.</li>
        </ol>
      </section>

      {/* Portfolio & GitHub Pages Footer Note */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-200">Ready for Personal Portfolio & GitHub Pages</span>
          <p className="mt-0.5">Calculated 100% in-browser using React, Canvas, and TypeScript without external server dependencies.</p>
        </div>
        <div className="font-mono text-cyan-400 text-xs">
          SPA Ready
        </div>
      </div>
    </div>
  );
};

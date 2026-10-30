import React from 'react';
import { ArrowLeft, BookOpen, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, Activity, Heart, Wind, Footprints, Zap } from 'lucide-react';

interface ClinicalWhitepaperViewProps {
  onBackToSimulator: () => void;
}

export const ClinicalWhitepaperView: React.FC<ClinicalWhitepaperViewProps> = ({ onBackToSimulator }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 text-slate-300 pb-16">
      {/* Return to Product Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBackToSimulator}
          className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Wearable Product Simulator</span>
        </button>
        <span className="text-xs font-mono text-slate-500">
          DOCUMENTATION · CLINICAL FRAMEWORK
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <span>PROJECT AURA</span>
          <span className="text-slate-600">·</span>
          <span>AUTONOMIC NEUROSCIENCE & WEARABLE DATA PATTERNS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          Clinical Framework, Glossary & Multi-Signal Pattern Methodology
        </h1>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          A plain-English guide to understanding why commercial stress algorithms fail, what aim the 3-Dimensional model
          achieves, complete demystification of medical acronyms, and how multi-sensor patterns are formed.
        </p>
      </div>

      {/* SECTION 1: 4-STAGE vs 3D MODEL */}
      <section className="space-y-4 bg-[#0D121F] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-semibold">
          <span>Core Concept</span>
        </div>
        <h2 className="text-lg font-bold text-slate-100">
          1. The 4-Stage Pipeline vs. 3D Parallel Model: What Aim Are We Getting At?
        </h2>

        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Most modern commercial wearables (such as Apple Watch, Garmin, Whoop, and Oura) implicitly follow a
            <strong className="text-slate-100"> 4-Stage Linear Sequence</strong>:
          </p>

          {/* 4 Stage Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center font-mono text-[11px] my-3">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="text-cyan-400 font-bold">Stage 1: Baseline</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Learns resting HR/EDA</div>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="text-rose-400 font-bold">Stage 2: Trigger</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Spike above baseline</div>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="text-amber-400 font-bold">Stage 3: Recovery</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Falling back to baseline</div>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="text-red-400 font-bold">Stage 4: Overload</div>
              <div className="text-slate-400 text-[10px] mt-0.5">3 triggers = Siren Alert!</div>
            </div>
          </div>

          <p>
            <strong className="text-rose-400">Why the 4-Stage Pipeline fails:</strong> It operates on the flawed assumption that
            <strong className="text-slate-100"> physiological arousal = emotional distress</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>
              <strong className="text-slate-200">The False Alarm Problem:</strong> When you climb 3 flights of stairs to a meeting or walk briskly, your heart rate surges to 135 BPM and your skin sweats. The naive 4-stage pipeline registers this as a "Panic Attack / Acute Stress Crisis" because it ignores physical movement.
            </li>
            <li>
              <strong className="text-slate-200">The Dangerous Blind Spot (Freeze / Shutdown):</strong> When a person experiences deep trauma, panic paralysis, or emotional numbness (Stephen Porges' <em>Polyvagal Theory</em>), the heart rate can paradoxically slow down (bradycardia, 52 BPM) and the body freezes still. The naive pipeline looks at low HR and low sweat and compliments the user: <em>"You are in a peaceful, meditative calm!"</em> while they are in severe crisis.
            </li>
            <li>
              <strong className="text-slate-200">The Alarm Fatigue Problem:</strong> Counting triggers rigidly (e.g. 3 spikes in an hour = Overload) interrupts productive developers, surgeons, or presenters who are thriving under healthy focus.
            </li>
          </ul>

          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg mt-3">
            <span className="font-bold text-cyan-300">The Aim of the 3-Dimensional Parallel Model:</span>
            <p className="text-slate-300 mt-1 leading-relaxed">
              Instead of pretending one simple formula can read a human mind from wrist sensors, the 3D model tracks three separate, honest dimensions in parallel:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-slate-300">
              <li><strong className="text-slate-100">Physiological Activation (Context-Aware):</strong> Measures how far vitals moved from baseline, but <em>subtracts physical motion</em> (accelerometer). High HR + motion = Exercise. High HR + stationary = True autonomic arousal.</li>
              <li><strong className="text-slate-100">Persistence & Recovery Trajectory:</strong> Examines the <em>recovery decay slope</em> over time rather than arbitrary counts. Fast rebound = healthy resilience. Flatter recovery slopes over successive days = true autonomic burnout.</li>
              <li><strong className="text-slate-100">Self-Reported Human State (User Agency):</strong> Gives the human the final say! A quiet, 1-tap check-in ("Are you exercising, focused, or distressed?") respects user dignity and prevents intrusive false alarms.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* SECTION 2: GLOSSARY & ACRONYMS */}
      <section className="space-y-4 bg-[#0D121F] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-semibold">
          <span>Medical Translation</span>
        </div>
        <h2 className="text-lg font-bold text-slate-100">
          2. Plain-English Glossary: What Do These Terms & Acronyms Actually Mean?
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Is the goal of these terms to sound fancy? In medical literature, precise mathematical terms are used to avoid ambiguity.
          However, consumer health products must translate them into everyday human language:
        </p>

        <div className="space-y-3 text-xs pt-1">
          {/* HRV RMSSD */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-cyan-300 text-sm">HRV RMSSD</span>
              <span className="font-mono text-[10px] text-slate-400">Heart Rate Variability</span>
            </div>
            <div className="text-slate-200 font-medium">
              Full Form: <span className="text-cyan-200">Root Mean Square of Successive Differences (in milliseconds, ms)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>In Plain English:</strong> A healthy heart does <em>not</em> tick like a mechanical metronome. At 60 beats per minute, the time between beat 1 and beat 2 might be 0.95 seconds, while between beat 2 and beat 3 it might be 1.05 seconds. This tiny millisecond variation is created by your <strong>vagus nerve</strong> breathing life into your heart.
            </p>
            <p className="text-slate-300">
              • <strong>High HRV (e.g. &gt;50 ms):</strong> Your nervous system is flexible, resilient, calm, and able to adapt immediately.<br />
              • <strong>Low HRV (e.g. &lt;20 ms):</strong> Your nervous system is locked into a rigid stress response or deep physical exhaustion.
            </p>
          </div>

          {/* SAM Axis */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-rose-300 text-sm">Sympathetic (SAM Axis / Arousal)</span>
              <span className="font-mono text-[10px] text-slate-400">Fight or Flight</span>
            </div>
            <div className="text-slate-200 font-medium">
              Full Form: <span className="text-rose-200">Sympathetic-Adrenal-Medullary Axis</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>In Plain English:</strong> Think of this as your body's <strong>gas pedal</strong>. When you face danger, excitement, or physical exertion, the SAM axis releases adrenaline and noradrenaline into the bloodstream within milliseconds. Your heart beats faster, blood pressure rises, and sweat glands activate to cool you down for action.
            </p>
          </div>

          {/* PNS / Vagal Brake */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-emerald-300 text-sm">Parasympathetic (PNS / Vagal Brake)</span>
              <span className="font-mono text-[10px] text-slate-400">Rest & Digest</span>
            </div>
            <div className="text-slate-200 font-medium">
              Full Form: <span className="text-emerald-200">Parasympathetic Nervous System (Vagus Nerve)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>In Plain English:</strong> Think of this as your body's <strong>brake pedal</strong>. The vagus nerve releases acetylcholine onto the heart's pacemaker (sinoatrial node), physically slowing down each beat. When the brake is on, you feel relaxed, digestion flows, and your body repairs itself.
            </p>
          </div>

          {/* EDA */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-amber-300 text-sm">EDA (GSR)</span>
              <span className="font-mono text-[10px] text-slate-400">Micro-Sweat Conductance</span>
            </div>
            <div className="text-slate-200 font-medium">
              Full Form: <span className="text-amber-200">Electrodermal Activity (formerly Galvanic Skin Response, in micro-Siemens, µS)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>In Plain English:</strong> Human skin contains millions of microscopic eccrine sweat glands on the palms and wrists that are innervated <em>only</em> by sympathetic nerves. When stressed or exerting, tiny sweat droplets fill these pores, increasing electrical conductance.
            </p>
            <p className="text-slate-300">
              • <strong>Tonic SCL:</strong> The slow, baseline skin conductance level over hours.<br />
              • <strong>Phasic SCR:</strong> The sudden, rapid wave/burst that spikes 1–3 seconds after an emotional thought or shock.
            </p>
          </div>

          {/* RSA & SQI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
              <span className="font-bold text-sky-300">RSA (Respiratory Sinus Arrhythmia)</span>
              <p className="text-slate-400">
                The natural synchronization between breathing and heart rate: your heart gently speeds up as you inhale, and slows down as you exhale.
              </p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
              <span className="font-bold text-slate-200">SQI (Signal Quality Index)</span>
              <p className="text-slate-400">
                A 0–100% confidence metric. If your wristband is loose or bouncing, optical light leaks occur. If SQI &lt; 50%, algorithms must freeze inferences rather than guessing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW WE FORM PATTERNS */}
      <section className="space-y-4 bg-[#0D121F] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-semibold">
          <span>Multi-Sensor Synthesis</span>
        </div>
        <h2 className="text-lg font-bold text-slate-100">
          3. How Do We Form Patterns Looking at the Data?
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          A common mistake in wearable technology is looking at a single number in isolation. A heart rate of 125 BPM
          means nothing on its own. To form an accurate clinical pattern, the system performs <strong className="text-cyan-400">multi-sensor fusion</strong>:
          it examines the relationship between <strong>Heart Rate + Sweat (EDA) + Accelerometer Motion + Self-Report</strong>:
        </p>

        {/* Pattern Matrix Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Physiological Pattern</th>
                <th className="py-2.5 px-3">Heart Rate</th>
                <th className="py-2.5 px-3">EDA (Sweat)</th>
                <th className="py-2.5 px-3">Motion (g)</th>
                <th className="py-2.5 px-3">Subject Report</th>
                <th className="py-2.5 px-3">Diagnostic Pattern Formed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              <tr className="hover:bg-slate-900/50">
                <td className="py-2.5 px-3 font-semibold text-emerald-300">1. Physical Exercise</td>
                <td className="py-2.5 px-3 font-mono text-rose-400">High (130+)</td>
                <td className="py-2.5 px-3 font-mono text-amber-400">High (11 µS)</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400">High (&gt;1.5g)</td>
                <td className="py-2.5 px-3 text-slate-400">0/10 Distress</td>
                <td className="py-2.5 px-3 text-emerald-300">Metabolic Exertion. Suppress stress alert.</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-2.5 px-3 font-semibold text-rose-300">2. Acute Panic / Social Stress</td>
                <td className="py-2.5 px-3 font-mono text-rose-400">High (125+)</td>
                <td className="py-2.5 px-3 font-mono text-amber-400">Phasic Bursts</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Near Zero (0.05g)</td>
                <td className="py-2.5 px-3 text-rose-400 font-semibold">8-10/10 Distress</td>
                <td className="py-2.5 px-3 text-rose-300">True Fight-or-Flight. Offer silent grounding tool.</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-2.5 px-3 font-semibold text-indigo-300">3. Polyvagal Freeze / Trauma</td>
                <td className="py-2.5 px-3 font-mono text-indigo-400">Low / Flat (54)</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">Blunted (1.2 µS)</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">Immobile (0.01g)</td>
                <td className="py-2.5 px-3 text-indigo-300 font-semibold">High Distress / Numb</td>
                <td className="py-2.5 px-3 text-indigo-300">Dorsal Vagal Shutdown. Do not call "calm meditation"!</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-2.5 px-3 font-semibold text-teal-300">4. Resilient Work Sprint</td>
                <td className="py-2.5 px-3 font-mono text-amber-400">Moderate (88)</td>
                <td className="py-2.5 px-3 font-mono text-amber-400">Moderate (5 µS)</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Low (0.1g)</td>
                <td className="py-2.5 px-3 text-emerald-300">High Readiness (8/10)</td>
                <td className="py-2.5 px-3 text-teal-300">Resilient Demand. Rapid recovery &lt;120s. Do not interrupt.</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-2.5 px-3 font-semibold text-amber-300">5. Chronic Burnout / Fatigue</td>
                <td className="py-2.5 px-3 font-mono text-amber-400">Elevated Base (82)</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Sluggish Reactivity</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">Low</td>
                <td className="py-2.5 px-3 text-amber-300">Low Readiness (3/10)</td>
                <td className="py-2.5 px-3 text-amber-300">Allostatic Depletion. Suggest micro-rest pause.</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="py-2.5 px-3 font-semibold text-slate-400">6. Sensor Contact Decoupling</td>
                <td className="py-2.5 px-3 font-mono text-red-400">Erratic (160)</td>
                <td className="py-2.5 px-3 font-mono text-red-400">Cliff drop</td>
                <td className="py-2.5 px-3 font-mono text-amber-400">Variable</td>
                <td className="py-2.5 px-3 text-slate-400">Nominal</td>
                <td className="py-2.5 px-3 text-slate-400">Noise Artifact (SQI &lt; 50%). Prompt wristband fit check.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: SIMULATOR CONTROLS SUMMARY */}
      <section className="space-y-4 bg-[#0D121F] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-semibold">
          <span>Interaction Guide</span>
        </div>
        <h2 className="text-lg font-bold text-slate-100">
          4. Simulator Buttons & Injections: What Do They Do Biologically?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-rose-300">+ Inject Stress Spike</span>
            <p className="text-slate-400 leading-relaxed">
              Simulates a sudden acute psychological shock (e.g. an aggressive verbal confrontation or sudden panic trigger). Instantly boosts heart rate (+35 BPM), collapses HRV RMSSD, and fires spontaneous phasic sweat bursts while the body remains stationary.
            </p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-cyan-300">+ Deep Breath Recovery</span>
            <p className="text-slate-400 leading-relaxed">
              Simulates diaphragmatic 4-7-8 deep breathing. Slow prolonged exhalations stimulate the vagus nerve (parasympathetic activation), engaging the vagal brake to slow the heart rate and restore HRV.
            </p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-emerald-300">+ Movement / Climb Stairs</span>
            <p className="text-slate-400 leading-relaxed">
              Simulates skeletal muscle locomotion. Accelerometer surges to 1.8g. Shows visitors how the 3D model properly suppresses false panic alarms by accounting for physical movement.
            </p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-amber-300">Loosen Wristband (Artifact)</span>
            <p className="text-slate-400 leading-relaxed">
              Simulates optical photodiode decoupling from the capillary bed. Injects optical motion noise and drops Signal Quality Index (SQI) to 30%, demonstrating why ethical algorithms refuse to guess on corrupt data.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: CLINICAL ROADMAP & BOTTOM BUTTON */}
      <section className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-xs text-slate-400">
        <h3 className="text-sm font-bold text-slate-100">5. Validation with Clinical Psychologists</h3>
        <p className="leading-relaxed">
          The ultimate recommendation of Project AURA is simple: Never train a system merely to recognize a raw biometric spike and call it emotional overload.
          First, establish what sensors can reliably measure. Second, validate what can be inferred with multi-sensor fusion.
          Third, collaborate with clinical psychologists to ensure that wearable interventions empower user autonomy rather than inducing alarm fatigue.
        </p>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onBackToSimulator}
            className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Interactive Wearable Simulator</span>
          </button>
          <span className="font-mono text-[11px] text-slate-500">
            Project AURA · Browser-Engine Ready
          </span>
        </div>
      </section>
    </div>
  );
};

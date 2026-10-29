/**
 * Types and interfaces for the Wearable Physiology & Stress Dynamics Simulator.
 */

export type SimulationModeId =
  | 'resting_baseline'
  | 'physical_exercise'
  | 'acute_panic'
  | 'freeze_shutdown'
  | 'chronic_exhaustion'
  | 'resilient_triggers'
  | 'allostatic_overload'
  | 'sensor_artifact'
  | 'custom_sandbox';

export interface PhysiologicalSample {
  timestamp: number; // elapsed seconds
  heartRate: number; // beats per minute (e.g. 50 - 180)
  hrvRmssd: number; // root mean square of successive differences, ms (e.g. 10 - 120)
  edaTonic: number; // Skin conductance level (SCL), microSiemens (e.g. 1 - 20)
  edaPhasic: number; // Skin conductance response (SCR) burst peak, microSiemens (0 - 8)
  edaTotal: number; // tonic + phasic
  respirationRate: number; // breaths per minute (e.g. 8 - 36)
  skinTemperature: number; // Celsius (e.g. 29.5 - 35.5)
  motionActivity: number; // 3-axis accelerometer norm, g (0 - 3.5)
  signalQualityIndex: number; // SQI percentage 0 - 100%
  ecgVoltage: number; // instantaneous microvolts for live ECG trace
  ppgValue: number; // photoplethysmogram pulse value 0 - 1
  respirationPhase: number; // instantaneous breathing wave -1 to 1
}

export interface SimulationContext {
  environmentTemp: number; // Celsius, e.g. 21°C
  caffeineIntakeMg: number; // e.g. 0 to 400 mg
  sleepQualityScore: number; // 0 to 100%
  baselineShiftDrift: number; // subtle circadian or chronic drift in HR
  isMoving: boolean;
  isSensorLoose: boolean;
  subjectReportedDistress: number; // 0 to 10 self-reported distress
  subjectReportedReadiness: number; // 0 to 10 self-reported energy/coping
  subjectPrivacyPreference: 'open_checkins' | 'silent_logging' | 'do_not_disturb';
}

export interface StagePipelineStatus {
  // Stage 1 - Baseline
  stage1: {
    baselineHr: number;
    baselineEda: number;
    baselineHrv: number;
    isFixedBaselineUsed: boolean;
    baselineStabilityScore: number; // 0-100%
    baselineDriftDetected: boolean;
    driftMagnitudeBpm: number;
    warnings: string[];
  };
  // Stage 2 - Trigger Response
  stage2: {
    triggerDetected: boolean;
    triggerConfidence: number; // 0-100%
    naiveLabel: string; // e.g. "PANIC DETECTED" or "NORMAL"
    calibratedLabel: string; // e.g. "Physiological Arousal Detected (Physical Activity Likely)"
    arousalMagnitude: number; // 0-100%
    confoundingFactors: string[];
  };
  // Stage 3 - Recovery Check
  stage3: {
    isRecovering: boolean;
    timeInDeviationSec: number;
    recoveryHalfLifeSec: number;
    physiologicalVsEmotionalMatch: 'congruent' | 'lagging_emotional' | 'blunted_arousal' | 'unknown';
    perceivedRecoveryProgress: number; // 0-100%
    physiologicalRecoveryProgress: number; // 0-100%
  };
  // Stage 4 - Possible Overload
  stage4: {
    overloadAlarmTriggered: boolean;
    triggerCountWindow: number; // naive count of triggers in last 30 mins
    escalationRiskScore: number; // 0-100%
    interventionRecommendation: 'none' | 'passive_log' | 'low_friction_checkin' | 'emergency_alert';
    ethicalCaveats: string[];
  };
}

export interface ThreeDimensionalModelStatus {
  // Dimension 1: Physiological Activation
  dimension1Activation: {
    normalizedScore: number; // 0 - 100 (distance from context-aware baseline)
    contextAdjustedBaselineHr: number;
    movementAdjustedHrDelta: number;
    edaResponseConfidence: number; // accounting for temp & motion
    category: 'quiescent' | 'mild_activation' | 'moderate_activation' | 'high_activation' | 'extreme';
  };
  // Dimension 2: Persistence & Recovery Trajectory
  dimension2Persistence: {
    durationOfDeviationSec: number;
    recoverySlopeBpmPerMin: number;
    allostaticDecayRate: number; // how much slower each successive recovery is
    recurrenceCount1Hr: number;
    trajectoryStatus: 'rapid_rebound' | 'stable_plateau' | 'decaying_recovery' | 'unremitting';
  };
  // Dimension 3: Self-Reported State & Readiness
  dimension3SelfReport: {
    reportedDistress: number; // 0 - 10
    reportedReadiness: number; // 0 - 10
    agencyPreference: 'open_checkins' | 'silent_logging' | 'do_not_disturb';
    perceivedControl: number; // 0 - 10
    congruenceWithPhysiology: string;
  };
  // Synthesis: Orthogonal Action Recommendation
  recommendedAction: {
    actionType: 'none' | 'silent_log' | 'gentle_checkin' | 'recovery_prompt' | 'low_confidence_flag';
    priority: 'low' | 'medium' | 'high';
    reasoning: string;
    clinicianValidationNote: string;
    userAgencyRespect: string;
  };
}

export interface SimulationPreset {
  id: SimulationModeId;
  name: string;
  shortDescription: string;
  clinicalContext: string;
  whatSensorsShow: string;
  whyNaiveModelFails: string;
  threeDAdvantage: string;
  initialContext: Partial<SimulationContext>;
  baselineHr: number;
  targetHr: number;
  hrvRmssd: number;
  edaTonic: number;
  edaPhasicPeak: number;
  respirationRate: number;
  skinTemp: number;
  motion: number;
  sqi: number;
  reportedDistress: number;
  reportedReadiness: number;
}

export interface DifficultTestCase {
  id: string;
  title: string;
  scenario: string;
  expectedTrueState: string;
  naiveModelVerdict: {
    label: string;
    isError: boolean;
    errorType: 'False Alarm' | 'Missed Distress' | 'Premature Alert' | 'Rigid Count Error' | 'Sensor Noise Confusion';
    consequence: string;
  };
  threeDModelVerdict: {
    label: string;
    isError: boolean;
    rationale: string;
    clinicalMerit: string;
  };
}

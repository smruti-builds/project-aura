import {
  PhysiologicalSample,
  SimulationContext,
  SimulationPreset,
  StagePipelineStatus,
  ThreeDimensionalModelStatus,
} from '../types/simulator';

export class WearableSimulationEngine {
  private currentPreset: SimulationPreset;
  private context: SimulationContext;
  private timeSec: number = 0;
  private sampleHistory: PhysiologicalSample[] = [];
  private maxHistorySamples: number = 300; // keep ~30 seconds at 10Hz
  private triggerCountInWindow: number = 0;
  private lastTriggerTime: number = -999;
  private recoveryStartTime: number = -999;
  private activeStressorMagnitude: number = 0; // 0 to 1
  private currentActualHr: number;
  private currentActualEdaTonic: number;
  private currentActualEdaPhasic: number;
  private currentActualHrv: number;
  private currentActualResp: number;
  private currentActualTemp: number;
  private currentActualMotion: number;
  private currentActualSqi: number;

  constructor(initialPreset: SimulationPreset) {
    this.currentPreset = initialPreset;
    this.context = {
      environmentTemp: initialPreset.initialContext.environmentTemp ?? 21.5,
      caffeineIntakeMg: initialPreset.initialContext.caffeineIntakeMg ?? 0,
      sleepQualityScore: initialPreset.initialContext.sleepQualityScore ?? 80,
      baselineShiftDrift: initialPreset.initialContext.baselineShiftDrift ?? 0,
      isMoving: initialPreset.initialContext.isMoving ?? false,
      isSensorLoose: initialPreset.initialContext.isSensorLoose ?? false,
      subjectReportedDistress: initialPreset.reportedDistress,
      subjectReportedReadiness: initialPreset.reportedReadiness,
      subjectPrivacyPreference: initialPreset.initialContext.subjectPrivacyPreference ?? 'open_checkins',
    };

    this.currentActualHr = initialPreset.targetHr;
    this.currentActualEdaTonic = initialPreset.edaTonic;
    this.currentActualEdaPhasic = initialPreset.edaPhasicPeak;
    this.currentActualHrv = initialPreset.hrvRmssd;
    this.currentActualResp = initialPreset.respirationRate;
    this.currentActualTemp = initialPreset.skinTemp;
    this.currentActualMotion = initialPreset.motion;
    this.currentActualSqi = initialPreset.sqi;

    if (initialPreset.id === 'allostatic_overload' || initialPreset.id === 'resilient_triggers') {
      this.triggerCountInWindow = 2; // pre-seed past triggers
    }
  }

  public setPreset(preset: SimulationPreset) {
    this.currentPreset = preset;
    this.context = {
      ...this.context,
      ...preset.initialContext,
      subjectReportedDistress: preset.reportedDistress,
      subjectReportedReadiness: preset.reportedReadiness,
    };
    if (preset.id === 'allostatic_overload' || preset.id === 'resilient_triggers') {
      this.triggerCountInWindow = 2;
    } else {
      this.triggerCountInWindow = 0;
    }
    this.activeStressorMagnitude = 0;
  }

  public updateContext(partial: Partial<SimulationContext>) {
    this.context = { ...this.context, ...partial };
  }

  public getContext(): SimulationContext {
    return { ...this.context };
  }

  public injectStressor(magnitude: number = 0.8) {
    this.activeStressorMagnitude = Math.min(1, Math.max(0, magnitude));
    this.triggerCountInWindow += 1;
    this.lastTriggerTime = this.timeSec;
    this.recoveryStartTime = -999;
  }

  public injectRelaxation() {
    this.activeStressorMagnitude = 0;
    this.recoveryStartTime = this.timeSec;
    this.context.subjectReportedDistress = Math.max(0, this.context.subjectReportedDistress - 3);
  }

  public toggleMotion() {
    this.context.isMoving = !this.context.isMoving;
  }

  public toggleSensorFit() {
    this.context.isSensorLoose = !this.context.isSensorLoose;
  }

  /**
   * Advance simulation clock by dt seconds (typically 0.1s at 10Hz)
   */
  public step(dt: number = 0.1): {
    sample: PhysiologicalSample;
    stagePipeline: StagePipelineStatus;
    threeDModel: ThreeDimensionalModelStatus;
  } {
    this.timeSec += dt;

    // Gradual decay of injected stressor
    if (this.activeStressorMagnitude > 0) {
      const decaySpeed = this.currentPreset.id === 'allostatic_overload' ? 0.005 : 0.03;
      this.activeStressorMagnitude = Math.max(0, this.activeStressorMagnitude - dt * decaySpeed);
    }

    // Determine target values influenced by preset, stressor, context
    let targetHr = this.currentPreset.targetHr;
    let targetHrv = this.currentPreset.hrvRmssd;
    let targetEdaTonic = this.currentPreset.edaTonic;
    let targetEdaPhasic = this.currentPreset.edaPhasicPeak;
    let targetResp = this.currentPreset.respirationRate;
    let targetTemp = this.currentPreset.skinTemp;
    let targetMotion = this.context.isMoving ? 1.6 : this.currentPreset.motion;
    let targetSqi = this.context.isSensorLoose ? 30 : this.currentPreset.sqi;

    // Apply active stressor boost
    if (this.activeStressorMagnitude > 0) {
      targetHr += this.activeStressorMagnitude * 35;
      targetHrv = Math.max(12, targetHrv - this.activeStressorMagnitude * 28);
      targetEdaPhasic += this.activeStressorMagnitude * 4.5;
      targetResp += this.activeStressorMagnitude * 8;
    }

    // Apply caffeine & sleep modifiers
    targetHr += (this.context.caffeineIntakeMg / 100) * 4;
    targetHr += this.context.baselineShiftDrift;
    if (this.context.sleepQualityScore < 50) {
      targetHrv = Math.max(10, targetHrv - 8);
      targetHr += 5;
    }

    // Apply movement impact on HR if moving
    if (this.context.isMoving && this.currentPreset.id !== 'physical_exercise') {
      targetHr += 35;
      targetResp += 7;
      targetEdaTonic += 3.0;
    }

    // Smooth approach towards target vitals
    const smoothing = 0.08;
    this.currentActualHr += (targetHr - this.currentActualHr) * smoothing;
    this.currentActualHrv += (targetHrv - this.currentActualHrv) * smoothing;
    this.currentActualEdaTonic += (targetEdaTonic - this.currentActualEdaTonic) * (smoothing * 0.4);
    this.currentActualEdaPhasic += (targetEdaPhasic - this.currentActualEdaPhasic) * smoothing;
    this.currentActualResp += (targetResp - this.currentActualResp) * smoothing;
    this.currentActualTemp += (targetTemp - this.currentActualTemp) * (smoothing * 0.2);
    this.currentActualMotion += (targetMotion - this.currentActualMotion) * 0.2;
    this.currentActualSqi += (targetSqi - this.currentActualSqi) * 0.15;

    // Add subtle physiological micro-oscillations (Respiratory Sinus Arrhythmia)
    const respCycle = Math.sin(this.timeSec * ((this.currentActualResp / 60) * Math.PI * 2));
    const rsaHrDelta = respCycle * (this.currentActualHrv / 14); // higher HRV = more RSA oscillation
    const noise = (Math.random() - 0.5) * 1.2;

    const instantHr = Math.max(40, this.currentActualHr + rsaHrDelta + noise);
    const instantEda = Math.max(0.5, this.currentActualEdaTonic + Math.max(0, this.currentActualEdaPhasic) + (Math.random() - 0.5) * 0.05);

    // ECG & PPG synthesis based on instant heart rate
    const beatPeriod = 60 / instantHr;
    const beatPhase = (this.timeSec % beatPeriod) / beatPeriod; // 0 to 1 through cardiac cycle
    let ecgVoltage = 0;
    if (beatPhase < 0.1) {
      // P-wave
      ecgVoltage = 0.15 * Math.sin((beatPhase / 0.1) * Math.PI);
    } else if (beatPhase >= 0.15 && beatPhase < 0.22) {
      // Q-R-S complex
      const qrsPhase = (beatPhase - 0.15) / 0.07;
      if (qrsPhase < 0.2) ecgVoltage = -0.2;
      else if (qrsPhase < 0.6) ecgVoltage = 1.2; // R spike
      else ecgVoltage = -0.3; // S wave
    } else if (beatPhase >= 0.35 && beatPhase < 0.55) {
      // T-wave
      ecgVoltage = 0.3 * Math.sin(((beatPhase - 0.35) / 0.2) * Math.PI);
    }

    // PPG pulse wave (dicrotic notch)
    let ppgValue = 0;
    if (beatPhase < 0.4) {
      ppgValue = Math.sin((beatPhase / 0.4) * Math.PI);
    } else if (beatPhase < 0.6) {
      ppgValue = 0.25 * Math.sin(((beatPhase - 0.4) / 0.2) * Math.PI); // dicrotic wave
    }

    // If sensor is loose, inject severe optical motion noise
    if (this.context.isSensorLoose) {
      ecgVoltage += (Math.random() - 0.5) * 2.0;
      ppgValue = Math.random() * 0.9;
    }

    const sample: PhysiologicalSample = {
      timestamp: Math.round(this.timeSec * 10) / 10,
      heartRate: Math.round(instantHr * 10) / 10,
      hrvRmssd: Math.max(5, Math.round(this.currentActualHrv * 10) / 10),
      edaTonic: Math.round(this.currentActualEdaTonic * 100) / 100,
      edaPhasic: Math.round(this.currentActualEdaPhasic * 100) / 100,
      edaTotal: Math.round(instantEda * 100) / 100,
      respirationRate: Math.round(this.currentActualResp * 10) / 10,
      skinTemperature: Math.round(this.currentActualTemp * 100) / 100,
      motionActivity: Math.round(this.currentActualMotion * 100) / 100,
      signalQualityIndex: Math.round(Math.min(100, Math.max(0, this.currentActualSqi))),
      ecgVoltage: Math.round(ecgVoltage * 100) / 100,
      ppgValue: Math.round(ppgValue * 100) / 100,
      respirationPhase: respCycle,
    };

    this.sampleHistory.push(sample);
    if (this.sampleHistory.length > this.maxHistorySamples) {
      this.sampleHistory.shift();
    }

    // Evaluate models
    const stagePipeline = this.evaluateStagePipeline(sample);
    const threeDModel = this.evaluateThreeDModel(sample);

    return { sample, stagePipeline, threeDModel };
  }

  public getHistory(): PhysiologicalSample[] {
    return [...this.sampleHistory];
  }

  /**
   * Evaluates the Classic 4-Stage Pipeline:
   * Stage 1 Baseline -> Stage 2 Trigger -> Stage 3 Recovery -> Stage 4 Overload
   */
  private evaluateStagePipeline(sample: PhysiologicalSample): StagePipelineStatus {
    const fixedBaselineHr = 70; // Classic rigid assumption: fixed baseline
    const fixedBaselineEda = 3.5;
    const fixedBaselineHrv = 50;

    // Stage 1: Baseline stability
    const hrDelta = sample.heartRate - fixedBaselineHr;
    const isDrifting = Math.abs(this.context.baselineShiftDrift) > 5;
    const warnings: string[] = [];

    if (this.context.caffeineIntakeMg > 100) {
      warnings.push('Caffeine altering resting heart rate baseline');
    }
    if (this.context.sleepQualityScore < 60) {
      warnings.push('Poor sleep lowering parasympathetic recovery reserve');
    }
    if (this.context.isSensorLoose) {
      warnings.push('Sparse/unstable sensor contact detected');
    }
    if (isDrifting) {
      warnings.push(`Baseline drift detected (+${this.context.baselineShiftDrift} bpm shift)`);
    }

    const baselineStability = Math.max(20, 100 - Math.abs(this.context.baselineShiftDrift) * 3 - (this.context.isSensorLoose ? 45 : 0));

    // Stage 2: Trigger response
    // Naive model looks purely at HR > baseline + 18 or EDA > baseline + 3.0
    const triggerThresholdHr = fixedBaselineHr + 20;
    const triggerDetected = sample.heartRate > triggerThresholdHr || sample.edaTotal > 8.0;

    let naiveLabel = 'NOMINAL';
    let calibratedLabel = 'Normal Physiological Range';
    const confoundingFactors: string[] = [];

    if (sample.motionActivity > 0.8) {
      confoundingFactors.push('High Physical Motion (Locomotion / Stairs)');
    }
    if (sample.skinTemperature > 34.0) {
      confoundingFactors.push('Elevated Ambient / Peripheral Temperature');
    }
    if (this.context.isSensorLoose) {
      confoundingFactors.push('Optical Motion Artifact / Low SQI');
    }

    if (triggerDetected) {
      // The naive model makes the blunder of calling any high arousal "Panic Detected" or "Acute Stress"
      naiveLabel = 'PANIC / STRESS DETECTED';

      if (sample.motionActivity > 0.8) {
        calibratedLabel = 'Physiological Arousal Detected (Physical Exertion Likely)';
      } else if (this.context.isSensorLoose) {
        calibratedLabel = 'Unreliable Measurement (Motion Artifact / Sensor Decoupled)';
      } else {
        calibratedLabel = 'Physiological Arousal Detected (Awaiting Context / Report)';
      }
    } else if (sample.heartRate < 58 && sample.motionActivity < 0.05) {
      // In freeze shutdown, naive model sees low HR and calls it "Relaxed/Calm"
      naiveLabel = 'DEEP CALM / RELAXATION';
      calibratedLabel = 'Hypo-Arousal / Possible Vagal Freeze (Low Motion)';
    }

    // Stage 3: Recovery check
    const isElevated = sample.heartRate > fixedBaselineHr + 10;
    const isRecovering = !isElevated || (this.recoveryStartTime > 0 && this.timeSec - this.recoveryStartTime > 15);
    const timeInDeviation = triggerDetected ? Math.max(5, this.timeSec - this.lastTriggerTime) : 0;

    let matchType: 'congruent' | 'lagging_emotional' | 'blunted_arousal' | 'unknown' = 'congruent';
    if (sample.heartRate > 95 && this.context.subjectReportedDistress < 2) {
      matchType = 'blunted_arousal'; // high arousal, low distress (e.g. stairs)
    } else if (sample.heartRate < 75 && this.context.subjectReportedDistress > 6) {
      matchType = 'lagging_emotional'; // body settled or frozen, mind distressed
    }

    const physiologicalRecoveryProgress = isElevated ? Math.max(10, 100 - (sample.heartRate - fixedBaselineHr) * 2) : 100;
    const perceivedRecoveryProgress = Math.max(5, (10 - this.context.subjectReportedDistress) * 10);

    // Stage 4: Possible overload
    // Naive model uses rigid rule: triggerCount >= 3 in window = OVERLOAD ALARM
    const overloadAlarm = this.triggerCountInWindow >= 3 && isElevated;
    const escalationRisk = Math.min(100, this.triggerCountInWindow * 28 + (isElevated ? 25 : 0));

    let intervention: 'none' | 'passive_log' | 'low_friction_checkin' | 'emergency_alert' = 'none';
    if (overloadAlarm) {
      intervention = 'emergency_alert'; // rigid alert!
    } else if (triggerDetected) {
      intervention = 'low_friction_checkin';
    } else {
      intervention = 'passive_log';
    }

    const ethicalCaveats: string[] = [
      'Rigid trigger counting risks alarm fatigue during manageable high-focus work.',
      'Audible or intrusive alerts can embarrass users in professional or public settings.',
      'Treating physiological settlement as emotional resolution ignores masked trauma or numbness.',
    ];

    return {
      stage1: {
        baselineHr: fixedBaselineHr,
        baselineEda: fixedBaselineEda,
        baselineHrv: fixedBaselineHrv,
        isFixedBaselineUsed: true,
        baselineStabilityScore: Math.round(baselineStability),
        baselineDriftDetected: isDrifting,
        driftMagnitudeBpm: this.context.baselineShiftDrift,
        warnings,
      },
      stage2: {
        triggerDetected,
        triggerConfidence: this.context.isSensorLoose ? 25 : Math.min(95, 50 + hrDelta),
        naiveLabel,
        calibratedLabel,
        arousalMagnitude: Math.min(100, Math.max(0, (sample.heartRate - fixedBaselineHr) * 1.5)),
        confoundingFactors,
      },
      stage3: {
        isRecovering,
        timeInDeviationSec: Math.round(timeInDeviation),
        recoveryHalfLifeSec: this.currentPreset.id === 'allostatic_overload' ? 240 : 60,
        physiologicalVsEmotionalMatch: matchType,
        perceivedRecoveryProgress: Math.round(perceivedRecoveryProgress),
        physiologicalRecoveryProgress: Math.round(physiologicalRecoveryProgress),
      },
      stage4: {
        overloadAlarmTriggered: overloadAlarm,
        triggerCountWindow: this.triggerCountInWindow,
        escalationRiskScore: Math.round(escalationRisk),
        interventionRecommendation: intervention,
        ethicalCaveats,
      },
    };
  }

  /**
   * Evaluates the 3-Dimensional Parallel Model:
   * Dimension 1: Physiological Activation (Context-Aware)
   * Dimension 2: Persistence & Recovery Trajectory
   * Dimension 3: Self-Reported State & Readiness
   */
  private evaluateThreeDModel(sample: PhysiologicalSample): ThreeDimensionalModelStatus {
    // Dim 1: Context-aware baseline
    let contextBaselineHr = 68 + this.context.baselineShiftDrift;
    if (this.context.caffeineIntakeMg > 0) {
      contextBaselineHr += (this.context.caffeineIntakeMg / 100) * 3;
    }

    // Movement adjustment
    const expectedHrMovementBoost = sample.motionActivity * 32; // exercise increases HR legitimately
    const motionAdjustedBaseline = contextBaselineHr + expectedHrMovementBoost;

    // Activation is the delta from the MOVEMENT-ADJUSTED contextual baseline
    const uncontextualizedHrDelta = sample.heartRate - contextBaselineHr;
    const contextualHrDelta = sample.heartRate - motionAdjustedBaseline;

    let rawActivation = Math.max(0, contextualHrDelta * 1.8 + sample.edaPhasic * 10);
    if (sample.motionActivity > 1.0) {
      // Scale down emotional arousal inference when physical motion is verified
      rawActivation = Math.max(0, rawActivation * 0.35);
    }

    // Gate by SQI
    if (sample.signalQualityIndex < 50) {
      rawActivation = 10; // clamp inference on noisy signal
    }

    const activationScore = Math.min(100, Math.round(rawActivation));
    let activationCategory: 'quiescent' | 'mild_activation' | 'moderate_activation' | 'high_activation' | 'extreme' = 'quiescent';
    if (activationScore >= 75) activationCategory = 'extreme';
    else if (activationScore >= 50) activationCategory = 'high_activation';
    else if (activationScore >= 25) activationCategory = 'moderate_activation';
    else if (activationScore >= 10) activationCategory = 'mild_activation';

    // Dim 2: Persistence & Recovery Trajectory
    let trajectoryStatus: 'rapid_rebound' | 'stable_plateau' | 'decaying_recovery' | 'unremitting' = 'stable_plateau';
    let recoverySlope = -4.5; // bpm / min
    let allostaticDecay = 1.0;

    if (this.currentPreset.id === 'resilient_triggers') {
      trajectoryStatus = 'rapid_rebound';
      recoverySlope = -12.0;
    } else if (this.currentPreset.id === 'allostatic_overload') {
      trajectoryStatus = 'decaying_recovery';
      recoverySlope = -1.5;
      allostaticDecay = 2.4; // 2.4x longer recovery per cycle
    } else if (this.currentPreset.id === 'acute_panic') {
      trajectoryStatus = 'unremitting';
      recoverySlope = -0.5;
    }

    const durationSec = Math.round(sample.heartRate > contextBaselineHr + 10 ? 180 : 0);

    // Dim 3: Self-Reported State & Readiness
    const reportedDistress = this.context.subjectReportedDistress;
    const reportedReadiness = this.context.subjectReportedReadiness;
    let congruence = 'Physiological signals and subjective report are aligned.';

    if (sample.motionActivity > 1.0 && reportedDistress <= 2) {
      congruence = 'Elevated vitals match physical exertion; emotional distress is minimal.';
    } else if (sample.heartRate < 60 && reportedDistress >= 7) {
      congruence = 'Divergence: Low physiological arousal coexists with high subjective distress (Freeze / Shutdown pattern).';
    } else if (sample.heartRate > 110 && sample.motionActivity < 0.1 && reportedDistress >= 7) {
      congruence = 'Congruent acute panic: High non-motion arousal with high subjective overwhelm.';
    } else if (sample.signalQualityIndex < 50) {
      congruence = 'Sensor decoupling precludes physiological correlation; prioritize subjective report.';
    }

    // Synthesis & Recommended Action
    let actionType: 'none' | 'silent_log' | 'gentle_checkin' | 'recovery_prompt' | 'low_confidence_flag' = 'none';
    let priority: 'low' | 'medium' | 'high' = 'low';
    let reasoning = 'Vitals within normal limits. Subject reports comfortable state.';
    let clinicianNote = 'Maintain background logging. No intervention indicated.';
    let userAgency = 'User is undisturbed; autonomous control preserved.';

    if (sample.signalQualityIndex < 50) {
      actionType = 'low_confidence_flag';
      priority = 'low';
      reasoning = 'Signal quality degraded (SQI < 50%). Suppressing automated inferences to prevent false alarm fatigue.';
      clinicianNote = 'Recommend gentle hardware fit notification only. Never assume distress based on corrupt PPG.';
      userAgency = 'Notification is silent and purely technical.';
    } else if (sample.motionActivity > 1.0) {
      actionType = 'silent_log';
      priority = 'low';
      reasoning = 'Arousal is explained by physical locomotion (3-axis accelerometer norm > 1.0g).';
      clinicianNote = 'Sympathetic ergoreflex active. Suppress stress classification. Log as physical exercise.';
      userAgency = 'Zero interruption. User maintains uninterrupted workout focus.';
    } else if (this.currentPreset.id === 'freeze_shutdown' || (sample.heartRate < 65 && reportedDistress >= 7)) {
      actionType = 'gentle_checkin';
      priority = 'high';
      reasoning = 'Dorsal vagal freeze signature: Hypo-arousal with elevated self-reported distress or dissociation.';
      clinicianNote = 'Crucial clinical nuance: Traditional arousal models miss freeze states. Offer grounding without demanding speech.';
      userAgency = 'Offers discreet 1-tap grounding tools. Fully dismissible without recurring nagging.';
    } else if (trajectoryStatus === 'decaying_recovery' && reportedReadiness < 4) {
      actionType = 'recovery_prompt';
      priority = 'medium';
      reasoning = 'Allostatic accumulation: Recovery capacity between stressors is deteriorating over time.';
      clinicianNote = 'Preventive intervention window: Early allostatic load flag before overt clinical crisis.';
      userAgency = 'Suggests optional micro-rest pause. Respects Do Not Disturb preference.';
    } else if (activationCategory === 'high_activation' || activationCategory === 'extreme') {
      actionType = 'gentle_checkin';
      priority = 'high';
      reasoning = 'High physiological activation in the absence of physical movement.';
      clinicianNote = 'Acute non-motion sympathetic activation. Label as "Physiological Arousal", not "Panic", until validated.';
      userAgency = 'Discreet haptic nudge with simple binary check-in: [I am OK] or [Grounding Tools].';
    } else if (reportedDistress >= 6) {
      actionType = 'gentle_checkin';
      priority = 'medium';
      reasoning = 'Subject reports high subjective distress despite moderate physiological vitals.';
      clinicianNote = 'Empirical human-centric rule: Subjective report takes precedence over physiological stillness.';
      userAgency = 'Provides support pathway on user demand.';
    }

    return {
      dimension1Activation: {
        normalizedScore: activationScore,
        contextAdjustedBaselineHr: Math.round(motionAdjustedBaseline),
        movementAdjustedHrDelta: Math.round(contextualHrDelta),
        edaResponseConfidence: this.context.isSensorLoose ? 20 : 92,
        category: activationCategory,
      },
      dimension2Persistence: {
        durationOfDeviationSec: durationSec,
        recoverySlopeBpmPerMin: recoverySlope,
        allostaticDecayRate: allostaticDecay,
        recurrenceCount1Hr: this.triggerCountInWindow,
        trajectoryStatus,
      },
      dimension3SelfReport: {
        reportedDistress,
        reportedReadiness,
        agencyPreference: this.context.subjectPrivacyPreference,
        perceivedControl: Math.max(1, 10 - reportedDistress),
        congruenceWithPhysiology: congruence,
      },
      recommendedAction: {
        actionType,
        priority,
        reasoning,
        clinicianValidationNote: clinicianNote,
        userAgencyRespect: userAgency,
      },
    };
  }
}

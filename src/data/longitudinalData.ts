export interface DailyAutonomicRecord {
  dayName: string; // e.g. "Monday", "Tuesday"
  shortDay: string; // e.g. "Mon"
  dateLabel: string; // e.g. "Oct 24"
  restingHrBpm: number; // Resting Heart Rate
  nightlyHrvRmssd: number; // Nightly Root Mean Square of Successive Differences (ms)
  allostaticLoadScore: number; // 0 to 100 allostatic burden
  sleepHours: number; // e.g. 7.8 hrs
  sleepQualityPercent: number; // 0 - 100%
  triggersCount: number; // number of acute sympathetic events
  avgRecoveryMinutes: number; // average time to return to baseline
  caffeineMg: number; // caffeine intake
  activityMinutes: number; // exercise / active locomotion
  autonomicState: 'Optimal Resilience' | 'Moderate Strain' | 'Allostatic Accumulation' | 'Autonomic Exhaustion' | 'Restorative Rebound';
  clinicalSummary: string;
}

export const SEVEN_DAY_LONGITUDINAL_HISTORY: DailyAutonomicRecord[] = [
  {
    dayName: 'Monday',
    shortDay: 'Mon',
    dateLabel: 'Oct 23',
    restingHrBpm: 64,
    nightlyHrvRmssd: 68,
    allostaticLoadScore: 18,
    sleepHours: 8.2,
    sleepQualityPercent: 91,
    triggersCount: 2,
    avgRecoveryMinutes: 2.1,
    caffeineMg: 80,
    activityMinutes: 45,
    autonomicState: 'Optimal Resilience',
    clinicalSummary: 'Full parasympathetic restoration. High vagal tone (HRV 68ms) enabled rapid recovery after meeting stress.',
  },
  {
    dayName: 'Tuesday',
    shortDay: 'Tue',
    dateLabel: 'Oct 24',
    restingHrBpm: 66,
    nightlyHrvRmssd: 62,
    allostaticLoadScore: 24,
    sleepHours: 7.6,
    sleepQualityPercent: 85,
    triggersCount: 3,
    avgRecoveryMinutes: 3.4,
    caffeineMg: 120,
    activityMinutes: 50,
    autonomicState: 'Optimal Resilience',
    clinicalSummary: 'Nominal autonomic balance. Moderate workout followed by normal post-exercise vagal reactivation.',
  },
  {
    dayName: 'Wednesday',
    shortDay: 'Wed',
    dateLabel: 'Oct 25',
    restingHrBpm: 72,
    nightlyHrvRmssd: 44,
    allostaticLoadScore: 48,
    sleepHours: 6.2,
    sleepQualityPercent: 68,
    triggersCount: 4,
    avgRecoveryMinutes: 6.8,
    caffeineMg: 220,
    activityMinutes: 20,
    autonomicState: 'Moderate Strain',
    clinicalSummary: 'Baseline drift begins (+8 BPM above Mon). Sleep deficit and caffeine delayed sympathetic clearance.',
  },
  {
    dayName: 'Thursday',
    shortDay: 'Thu',
    dateLabel: 'Oct 26',
    restingHrBpm: 77,
    nightlyHrvRmssd: 28,
    allostaticLoadScore: 72,
    sleepHours: 5.4,
    sleepQualityPercent: 52,
    triggersCount: 5,
    avgRecoveryMinutes: 11.2,
    caffeineMg: 310,
    activityMinutes: 10,
    autonomicState: 'Allostatic Accumulation',
    clinicalSummary: 'Vagal brake suppression. Successive triggers show decaying recovery slopes; parasympathetic reserve low.',
  },
  {
    dayName: 'Friday',
    shortDay: 'Fri',
    dateLabel: 'Oct 27',
    restingHrBpm: 83,
    nightlyHrvRmssd: 17,
    allostaticLoadScore: 92,
    sleepHours: 4.8,
    sleepQualityPercent: 38,
    triggersCount: 6,
    avgRecoveryMinutes: 19.5,
    caffeineMg: 380,
    activityMinutes: 5,
    autonomicState: 'Autonomic Exhaustion',
    clinicalSummary: 'Allostatic Overload peak. Resting HR drifted +19 BPM; HRV collapsed to 17ms. Body is unable to clear sympathetic tone.',
  },
  {
    dayName: 'Saturday',
    shortDay: 'Sat',
    dateLabel: 'Oct 28',
    restingHrBpm: 74,
    nightlyHrvRmssd: 39,
    allostaticLoadScore: 54,
    sleepHours: 9.1,
    sleepQualityPercent: 78,
    triggersCount: 1,
    avgRecoveryMinutes: 5.2,
    caffeineMg: 50,
    activityMinutes: 30,
    autonomicState: 'Restorative Rebound',
    clinicalSummary: 'Initial recovery rebound. Prolonged sleep and low cognitive load allowed vagal reactivations.',
  },
  {
    dayName: 'Sunday',
    shortDay: 'Sun',
    dateLabel: 'Oct 29',
    restingHrBpm: 67,
    nightlyHrvRmssd: 58,
    allostaticLoadScore: 28,
    sleepHours: 8.4,
    sleepQualityPercent: 88,
    triggersCount: 1,
    avgRecoveryMinutes: 2.8,
    caffeineMg: 60,
    activityMinutes: 40,
    autonomicState: 'Optimal Resilience',
    clinicalSummary: 'Autonomic equilibrium restored. Resting HR re-converging to nominal 65-68 baseline; HRV reserve recovered.',
  },
];

export interface ExtractedExercise {
  name: string;
  weight?: number; // lbs
  reps?: number;
  sets?: number;
  runningTime?: number; // minutes
  maxHeartRate?: number;
}

export interface WorkoutEntry {
  id: string; // unique ID, e.g., timestamp or UUID
  date: string; // ISO string for date
  originalLog: string;
  extractedExercises: ExtractedExercise[];
}

export interface MonthlyTotals {
  totalWeightLifted: number; // lbs
  totalRunningTime: number; // minutes
}

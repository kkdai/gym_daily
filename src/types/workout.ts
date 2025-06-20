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
  exerciseVolumes: { [exerciseName: string]: number }; // Stores total volume for each exercise
  totalRunningTime: number; // minutes
}

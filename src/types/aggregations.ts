import type { WorkoutEntry } from './workout';

export interface WeeklyWorkoutReport {
  weekStartDate: string; // ISO string for the start of the week (e.g., Monday)
  weekDisplay: string; // User-friendly display like "Week of Oct 21, 2024"
  entries: WorkoutEntry[]; // All workout entries for that week
}

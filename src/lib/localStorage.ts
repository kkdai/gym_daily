import type { WorkoutEntry } from '@/types/workout';

const WORKOUT_STORAGE_KEY = 'gymDiaryWorkouts';

export function getWorkoutEntries(): WorkoutEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const entriesJson = window.localStorage.getItem(WORKOUT_STORAGE_KEY);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (error) {
    console.error('Error reading workout entries from local storage:', error);
    return [];
  }
}

export function saveWorkoutEntries(entries: WorkoutEntry[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving workout entries to local storage:', error);
  }
}

export function addWorkoutEntry(entry: WorkoutEntry): void {
  const entries = getWorkoutEntries();
  const updatedEntries = [entry, ...entries]; // Add new entry to the beginning
  saveWorkoutEntries(updatedEntries);
}

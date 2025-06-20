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

export function saveWorkoutEntries(entries: WorkoutEntry[]): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Error saving workout entries to local storage:', error);
    return false;
  }
}

export function addWorkoutEntry(entry: WorkoutEntry): boolean {
  const entries = getWorkoutEntries();
  const updatedEntries = [entry, ...entries]; // Add new entry to the beginning
  return saveWorkoutEntries(updatedEntries);
}


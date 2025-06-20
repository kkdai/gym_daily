import type { WorkoutEntry } from '@/types/workout';
import type { WeeklyWorkoutReport } from '@/types/aggregations';

/**
 * Gets the date for the Monday of the week for a given date.
 * @param date The input date.
 * @returns A new Date object set to 00:00:00 on Monday of that week.
 */
function getMondayOfWeek(date: Date): Date {
  const day = date.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Formats a date object into a "Week of Mon DD, YYYY" string.
 * @param date The input date (should be the start of the week).
 * @returns A formatted string.
 */
function formatWeekDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).replace(/, \d{4}$/, ` (${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`);
  // A bit of a hack to get "Mon, Oct 21 (Oct 21)" - can be refined
  // Simpler: "Week of " + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}


export function aggregateWorkoutsByWeek(
  workoutEntries: WorkoutEntry[]
): WeeklyWorkoutReport[] {
  if (!workoutEntries || workoutEntries.length === 0) {
    return [];
  }

  // Sort entries by date to ensure correct processing if not already sorted
  const sortedEntries = [...workoutEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const weeklyReportsMap = new Map<string, WeeklyWorkoutReport>();

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const monday = getMondayOfWeek(entryDate);
    const mondayISO = monday.toISOString().split('T')[0]; // Use YYYY-MM-DD as key

    if (!weeklyReportsMap.has(mondayISO)) {
      weeklyReportsMap.set(mondayISO, {
        weekStartDate: mondayISO,
        weekDisplay: `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        entries: [],
      });
    }
    weeklyReportsMap.get(mondayISO)!.entries.push(entry);
  }

  // Convert map to array and sort by week start date, descending (newest first)
  return Array.from(weeklyReportsMap.values()).sort(
    (a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime()
  );
}

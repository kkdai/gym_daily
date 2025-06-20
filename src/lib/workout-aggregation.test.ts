import { aggregateWorkoutsByWeek } from './workout-aggregation';
import type { WorkoutEntry } from '@/types/workout';
import type { WeeklyWorkoutReport } from '@/types/aggregations';

// Helper for assertions (basic)
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEquals(actual: any, expected: any, message:string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Assertion failed: ${message}. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// Test cases
function runAggregationTests() {
  console.log('Running aggregateWorkoutsByWeek tests...');

  // Test 1: Empty input
  const emptyEntries: WorkoutEntry[] = [];
  const emptyResult = aggregateWorkoutsByWeek(emptyEntries);
  assertEquals(emptyResult, [], 'Test 1: Empty input should return empty array');
  console.log('Test 1 Passed: Empty input');

  // Test 2: Single entry
  const singleEntry: WorkoutEntry[] = [
    { id: '1', date: '2024-03-15', originalLog: 'Log 1', extractedExercises: [{ name: 'Push ups', sets: 3, reps: 10 }] },
  ];
  const singleResult = aggregateWorkoutsByWeek(singleEntry);
  assert(singleResult.length === 1, 'Test 2: Single entry should result in one week report');
  assertEquals(singleResult[0].entries.length, 1, 'Test 2: Week report should contain one entry');
  assertEquals(singleResult[0].entries[0].id, '1', 'Test 2: Correct entry ID');
  assertEquals(singleResult[0].weekStartDate, '2024-03-11', 'Test 2: Correct week start date (Monday for 2024-03-15)');
  console.log('Test 2 Passed: Single entry');

  // Test 3: Multiple entries in the same week
  const sameWeekEntries: WorkoutEntry[] = [
    { id: '1', date: '2024-03-11', originalLog: 'Log 1', extractedExercises: [] }, // Mon
    { id: '2', date: '2024-03-13', originalLog: 'Log 2', extractedExercises: [] }, // Wed
    { id: '3', date: '2024-03-15', originalLog: 'Log 3', extractedExercises: [] }, // Fri
  ];
  const sameWeekResult = aggregateWorkoutsByWeek(sameWeekEntries);
  assert(sameWeekResult.length === 1, 'Test 3: Same week entries should result in one report');
  assertEquals(sameWeekResult[0].entries.length, 3, 'Test 3: Report should contain 3 entries');
  assertEquals(sameWeekResult[0].weekStartDate, '2024-03-11', 'Test 3: Correct week start');
  console.log('Test 3 Passed: Multiple entries, same week');

  // Test 4: Entries spanning multiple weeks, ensure descending order of weeks
  const multiWeekEntries: WorkoutEntry[] = [
    { id: '1', date: '2024-03-07', originalLog: 'Log 1 (Prev Week Thu)', extractedExercises: [] }, // Previous week
    { id: '2', date: '2024-03-11', originalLog: 'Log 2 (This Week Mon)', extractedExercises: [] }, // This week
    { id: '3', date: '2024-03-18', originalLog: 'Log 3 (Next Week Mon)', extractedExercises: [] }, // Next week
  ];
  const multiWeekResult = aggregateWorkoutsByWeek(multiWeekEntries);
  assert(multiWeekResult.length === 3, 'Test 4: Multi-week entries should result in 3 reports');
  assertEquals(multiWeekResult[0].weekStartDate, '2024-03-18', 'Test 4: First report is next week (newest)');
  assertEquals(multiWeekResult[1].weekStartDate, '2024-03-11', 'Test 4: Second report is this week');
  assertEquals(multiWeekResult[2].weekStartDate, '2024-03-04', 'Test 4: Third report is previous week (oldest)');
  console.log('Test 4 Passed: Multi-week entries, descending order');

  // Test 5: Entries at week boundaries (Sunday and Monday)
  const boundaryEntries: WorkoutEntry[] = [
    { id: 'sun', date: '2024-03-10', originalLog: 'Log Sun (End of week)', extractedExercises: [] }, // Sunday
    { id: 'mon', date: '2024-03-11', originalLog: 'Log Mon (Start of new week)', extractedExercises: [] }, // Monday
  ];
  const boundaryResult = aggregateWorkoutsByWeek(boundaryEntries);
  assert(boundaryResult.length === 2, 'Test 5: Boundary entries should be in two different weeks');
  assertEquals(boundaryResult[0].weekStartDate, '2024-03-11', 'Test 5: New week is first');
  assertEquals(boundaryResult[0].entries[0].id, 'mon', 'Test 5: Monday entry in new week');
  assertEquals(boundaryResult[1].weekStartDate, '2024-03-04', 'Test 5: Old week is second');
  assertEquals(boundaryResult[1].entries[0].id, 'sun', 'Test 5: Sunday entry in old week');
  console.log('Test 5 Passed: Week boundary entries');

  console.log('All aggregation tests passed!');
}

// Attempt to run tests
try {
  runAggregationTests();
} catch (e: any) {
  console.error('A test failed:', e.message);
  // Rethrow to indicate failure to the subtask runner if it's watching for errors
  throw e;
}

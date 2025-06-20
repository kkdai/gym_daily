'use client';

import * as React from 'react';
import type { WorkoutEntry, MonthlyTotals } from '@/types/workout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell, TimerIcon } from 'lucide-react';

interface MonthlySummaryProps {
  workoutEntries: WorkoutEntry[];
}

function calculateMonthlyTotals(entries: WorkoutEntry[]): MonthlyTotals {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const exerciseVolumes: { [exerciseName: string]: number } = {};
  let totalRunningTime = 0;

  entries.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
      entry.extractedExercises.forEach(ex => {
        if (ex.weight && ex.reps && ex.sets) {
          const volume = (ex.weight || 0) * (ex.reps || 0) * (ex.sets || 0);
          if (volume > 0) {
            exerciseVolumes[ex.name] = (exerciseVolumes[ex.name] || 0) + volume;
          }
        }
        if (ex.runningTime) {
          totalRunningTime += (ex.runningTime || 0);
        }
      });
    }
  });

  return { exerciseVolumes, totalRunningTime };
}

export function MonthlySummary({ workoutEntries }: MonthlySummaryProps) {
  const [summary, setSummary] = React.useState<MonthlyTotals>({ exerciseVolumes: {}, totalRunningTime: 0 });
  const [currentMonthName, setCurrentMonthName] = React.useState('');

  React.useEffect(() => {
    const totals = calculateMonthlyTotals(workoutEntries);
    setSummary(totals);
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    setCurrentMonthName(monthFormatter.format(new Date()));
  }, [workoutEntries]);

  const hasWeightData = Object.keys(summary.exerciseVolumes).length > 0;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">
          {currentMonthName} Progress
        </CardTitle>
        <CardDescription>Your workout summary for this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight Lifted Details</CardTitle>
              <Dumbbell className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {hasWeightData ? (
                <ul className="space-y-2">
                  {Object.entries(summary.exerciseVolumes).map(([name, volume]) => (
                    <li key={name} className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate pr-2" title={name}>{name}</span>
                      <span className="text-lg font-bold font-headline whitespace-nowrap">
                        {volume.toLocaleString()} lbs
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No weight lifting data for this month.</p>
              )}
              {hasWeightData && (
                <p className="text-xs text-muted-foreground mt-3">
                  Total volume (weight × reps × sets) per exercise.
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="bg-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Running Time</CardTitle>
              <TimerIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">
                {summary.totalRunningTime.toLocaleString()} min
              </div>
              <p className="text-xs text-muted-foreground">
                Total time spent on running activities
              </p>
            </CardContent>
          </Card>
        </div>
        {workoutEntries.length === 0 && (
          <p className="mt-4 text-center text-muted-foreground">Log some workouts to see your monthly summary!</p>
        )}
      </CardContent>
    </Card>
  );
}

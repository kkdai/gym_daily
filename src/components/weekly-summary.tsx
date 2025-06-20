'use client';

import * as React from 'react';
import type { WeeklyWorkoutReport } from '@/types/aggregations';
import type { WorkoutEntry, ExtractedExercise } from '@/types/workout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ListChecks, Weight, Repeat, Layers } from 'lucide-react';

interface WeeklySummaryProps {
  aggregatedWorkouts: WeeklyWorkoutReport[];
}

// Helper to format date for individual entries within a week
const formatEntryDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export function WeeklySummary({ aggregatedWorkouts }: WeeklySummaryProps) {
  if (!aggregatedWorkouts || aggregatedWorkouts.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No workouts logged yet to display weekly progress.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Weekly Progress</CardTitle>
        <CardDescription>Your workout summaries, week by week.</CardDescription>
      </CardHeader>
      <CardContent>
            <Accordion type="multiple" className="w-full space-y-4">
          {aggregatedWorkouts.map((weeklyReport) => (
            <AccordionItem value={weeklyReport.weekStartDate} key={weeklyReport.weekStartDate} className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/30 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-primary/80" />
                  <h3 className="text-lg font-semibold">{weeklyReport.weekDisplay}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 border-t">
                {weeklyReport.entries.length === 0 ? (
                  <p className="text-muted-foreground">No workouts recorded for this week.</p>
                ) : (
                  <div className="space-y-6">
                    {weeklyReport.entries.map((entry) => (
                      <div key={entry.id} className="p-4 border rounded-md shadow-sm bg-card/50">
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="secondary" className="text-sm">
                            {formatEntryDate(entry.date)}
                          </Badge>
                        </div>
                        {entry.extractedExercises.length > 0 ? (
                          <ul className="space-y-3">
                            {entry.extractedExercises.map((ex, index) => (
                              <li key={index} className="flex flex-col sm:flex-row sm:items-center sm:gap-4 p-3 rounded-md bg-background border">
                                <div className="flex items-center gap-2 font-semibold text-primary mb-1 sm:mb-0">
                                  <ListChecks className="h-4 w-4" />
                                  <span>{ex.name}</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                  {ex.weight !== undefined && (
                                    <div className="flex items-center gap-1">
                                      <Weight className="h-3.5 w-3.5" />
                                      <span>{ex.weight} lb</span>
                                    </div>
                                  )}
                                  {ex.reps !== undefined && (
                                    <div className="flex items-center gap-1">
                                      <Repeat className="h-3.5 w-3.5" />
                                      <span>{ex.reps} reps</span>
                                    </div>
                                  )}
                                  {ex.sets !== undefined && (
                                    <div className="flex items-center gap-1">
                                      <Layers className="h-3.5 w-3.5" />
                                      <span>{ex.sets} sets</span>
                                    </div>
                                  )}
                                  {ex.runningTime !== undefined && (
                                    <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
                                      <CalendarDays className="h-3.5 w-3.5" /> {/* Using CalendarDays for time too */}
                                      <span>{ex.runningTime} min</span>
                                    </div>
                                  )}
                                  {ex.maxHeartRate !== undefined && (
                                    <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
                                      <span>(Max HR: {ex.maxHeartRate})</span>
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No specific exercises extracted for this entry.</p>
                        )}
                        {entry.originalLog && (
                           <div className="mt-3 pt-3 border-t border-dashed">
                             <p className="text-xs text-muted-foreground/80 whitespace-pre-wrap leading-relaxed">
                               <strong>Original Log:</strong> {entry.originalLog}
                             </p>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

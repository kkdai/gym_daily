'use client';

import * as React from 'react';
import type { WorkoutEntry, ExtractedExercise } from '@/types/workout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, CalendarDays, NotebookText, BarChart3 } from 'lucide-react';

interface WorkoutTableProps {
  workoutEntries: WorkoutEntry[];
}

type SortKey = 'date'; // Add more keys if needed
type SortOrder = 'asc' | 'desc';

function formatExtractedExercises(exercises: ExtractedExercise[]): string {
  if (!exercises || exercises.length === 0) return 'No specific exercises extracted.';
  return exercises.map(ex => {
    let details = `${ex.name}`;
    if (ex.weight && ex.reps && ex.sets) {
      details += `: ${ex.weight}lb x ${ex.reps} reps x ${ex.sets} sets`;
    } else if (ex.runningTime) {
      details += `: ${ex.runningTime} min`;
      if (ex.maxHeartRate) {
        details += ` (Max HR: ${ex.maxHeartRate})`;
      }
    }
    return details;
  }).join('; ');
}

export function WorkoutTable({ workoutEntries }: WorkoutTableProps) {
  const [sortedEntries, setSortedEntries] = React.useState<WorkoutEntry[]>([]);
  const [sortKey, setSortKey] = React.useState<SortKey>('date');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');

  React.useEffect(() => {
    let newSortedEntries = [...workoutEntries];
    newSortedEntries.sort((a, b) => {
      const valA = new Date(a.date).getTime();
      const valB = new Date(b.date).getTime();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedEntries(newSortedEntries);
  }, [workoutEntries, sortKey, sortOrder]);

  const requestSort = (key: SortKey) => {
    let direction: SortOrder = 'asc';
    if (sortKey === key && sortOrder === 'asc') {
      direction = 'desc';
    }
    setSortKey(key);
    setSortOrder(direction);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Workout History</CardTitle>
        <CardDescription>Your logged workouts over time. Click headers to sort.</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedEntries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No workouts logged yet. Add your first workout above!</p>
        ) : (
          <ScrollArea className="h-[400px] md:h-[500px] rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[150px]">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort('date')}
                      className="px-2 py-1 h-auto"
                      aria-label="Sort by Date"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" /> Date
                      <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                       <NotebookText className="mr-2 h-4 w-4" /> Original Log
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[300px]">
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" /> Extracted Details
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-primary/5">
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {formatDate(entry.date)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm leading-relaxed whitespace-pre-wrap max-w-xs md:max-w-md break-words">
                      {entry.originalLog}
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.extractedExercises.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {entry.extractedExercises.map((ex, index) => (
                            <li key={index}>
                              <strong>{ex.name}</strong>
                              {ex.weight && ex.reps && ex.sets ? ` - ${ex.weight}lb × ${ex.reps} reps × ${ex.sets} sets` : ''}
                              {ex.runningTime ? ` - ${ex.runningTime} min` : ''}
                              {ex.maxHeartRate ? ` (Max HR: ${ex.maxHeartRate})` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground italic">No specific exercises extracted.</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

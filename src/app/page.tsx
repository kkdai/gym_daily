'use client';

import * as React from 'react';
import Image from 'next/image';
import { WorkoutInputForm } from '@/components/workout-input-form';
import { MonthlySummary } from '@/components/monthly-summary';
import { WorkoutTable } from '@/components/workout-table';
import type { WorkoutEntry } from '@/types/workout';
import { getWorkoutEntries } from '@/lib/localStorage';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Github, VenetianMask } from 'lucide-react';


// Simple SVG Logo for Gym Diary
const GymDiaryLogo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
    <path d="M15.07 7.06C14.15 6.39 13.06 6 12 6s-2.15.39-3.07 1.06C8.28 7.57 7.78 8.43 7.5 9.38L9.04 10c.16-.57.49-1.05.94-1.39.46-.34 1-.53 1.58-.53.57 0 1.12.19 1.58.53.45.34.78.82.94 1.39l1.54-.62c-.28-.95-.78-1.81-1.44-2.32zM12 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" fill="currentColor"/>
  </svg>
);


export default function HomePage() {
  const [workoutEntries, setWorkoutEntries] = React.useState<WorkoutEntry[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setWorkoutEntries(getWorkoutEntries());
  }, []);

  const handleWorkoutAdded = (newEntry: WorkoutEntry) => {
    // New entries are added to the beginning by addWorkoutEntry in localStorage, so re-fetch to reflect order
    setWorkoutEntries(getWorkoutEntries()); 
  };
  
  if (!isClient) {
    // Render a loading state or null during SSR to avoid hydration mismatches with localStorage
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-semibold">Loading Gym Diary...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background items-center">
      <header className="w-full bg-card shadow-md py-4 px-4 md:px-8 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GymDiaryLogo />
            <h1 className="text-3xl font-headline font-bold text-primary">Gym Diary</h1>
          </div>
           <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/firebase/genkit/tree/main/experimental/genkit-nextjs-starter" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">
              <Github className="h-6 w-6 text-foreground/80 hover:text-primary" />
            </a>
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 flex-grow w-full">
        <div className="space-y-8 max-w-4xl mx-auto">
          <WorkoutInputForm onWorkoutAdded={handleWorkoutAdded} />
          <Separator className="my-8 border-primary/20" />
          <MonthlySummary workoutEntries={workoutEntries} />
          <Separator className="my-8 border-primary/20" />
          <WorkoutTable workoutEntries={workoutEntries} />
        </div>
      </main>

      <footer className="w-full bg-card shadow-inner py-6 px-4 md:px-8 mt-12">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Gym Diary. Keep Pushing!</p>
          <p className="mt-1">Powered by GenAI and sheer willpower.</p>
        </div>
      </footer>
    </div>
  );
}

// Minimal loader component to avoid direct dependency
const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

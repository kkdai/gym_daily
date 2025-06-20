'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { processWorkoutLogAction } from '@/app/actions';
import type { WorkoutEntry, ExtractedExercise } from '@/types/workout';
import { addWorkoutEntry as saveEntryToLocalStorage } from '@/lib/localStorage';
import { Loader2, Send } from 'lucide-react';

const formSchema = z.object({
  workoutLog: z.string().min(10, { message: 'Workout log must be at least 10 characters.' }),
});

type WorkoutInputFormProps = {
  onWorkoutAdded: (newEntry: WorkoutEntry) => void;
};

export function WorkoutInputForm({ onWorkoutAdded }: WorkoutInputFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutLog: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setIsSubmitting(true);
    try {
      const extractedData = await processWorkoutLogAction({ workoutLog: data.workoutLog });
      
      const newEntry: WorkoutEntry = {
        id: new Date().toISOString() + Math.random().toString(36).substring(2, 9), // Simple unique ID
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        originalLog: data.workoutLog,
        extractedExercises: (extractedData.exercises || []) as ExtractedExercise[],
      };

      saveEntryToLocalStorage(newEntry);
      onWorkoutAdded(newEntry);
      toast({
        title: 'Workout Logged!',
        description: 'Your workout has been successfully saved.',
      });
      form.reset();
    } catch (error: any) {
      console.error('Error submitting workout log:', error);
      toast({
        variant: 'destructive',
        title: 'Error Processing Log',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Log Today's Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="workoutLog"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="workoutLogTextarea" className="text-base">Enter your workout details:</FormLabel>
                  <FormControl>
                    <Textarea
                      id="workoutLogTextarea"
                      placeholder="e.g., Running 30 mins (avg HR 150), Bench press 100lb 3x10, Squats 150lb 3x8..."
                      className="min-h-[150px] resize-y"
                      aria-label="Workout log input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting} aria-live="polite">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Save Workout
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

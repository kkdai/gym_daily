'use server';

/**
 * @fileOverview A workout data extraction AI agent.
 *
 * - extractWorkoutData - A function that handles the workout data extraction process.
 * - ExtractWorkoutDataInput - The input type for the extractWorkoutData function.
 * - ExtractWorkoutDataOutput - The return type for the extractWorkoutData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractWorkoutDataInputSchema = z.object({
  workoutLog: z
    .string()
    .describe("A free-text workout log containing exercise details, weight, reps, sets, running time, and max heart rate."),
});
export type ExtractWorkoutDataInput = z.infer<typeof ExtractWorkoutDataInputSchema>;

const ExtractWorkoutDataOutputSchema = z.object({
  exercises: z.array(
    z.object({
      name: z.string().describe('The name of the exercise.'),
      weight: z.number().optional().describe('The weight used for the exercise, in pounds.'),
      reps: z.number().optional().describe('The number of repetitions performed.'),
      sets: z.number().optional().describe('The number of sets performed.'),
      runningTime: z.number().optional().describe('The running time in minutes, if applicable.'),
      maxHeartRate: z.number().optional().describe('The maximum heart rate reached during the exercise, if applicable.'),
    })
  ).describe('An array of exercises extracted from the workout log.'),
});
export type ExtractWorkoutDataOutput = z.infer<typeof ExtractWorkoutDataOutputSchema>;

export async function extractWorkoutData(input: ExtractWorkoutDataInput): Promise<ExtractWorkoutDataOutput> {
  return extractWorkoutDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractWorkoutDataPrompt',
  input: {schema: ExtractWorkoutDataInputSchema},
  output: {schema: ExtractWorkoutDataOutputSchema},
  prompt: `You are a personal trainer. Your task is to extract structured workout data from free-text workout logs.

  Analyze the workout log provided and extract the following information for each exercise:

  - Exercise Name
  - Weight (in pounds, if applicable)
  - Reps (if applicable)
  - Sets (if applicable)
  - Running Time (in minutes, if applicable)
  - Max Heart Rate (if applicable)

  Workout Log:
  {{workoutLog}}

  Return the extracted data in JSON format.
  `,
});

const extractWorkoutDataFlow = ai.defineFlow(
  {
    name: 'extractWorkoutDataFlow',
    inputSchema: ExtractWorkoutDataInputSchema,
    outputSchema: ExtractWorkoutDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

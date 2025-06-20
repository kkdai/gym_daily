
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
      name: z.string().describe('The name of the exercise (e.g., "Bench press", "跑步").'),
      weight: z.coerce.number().optional().describe('Numeric value of the weight used, in pounds (e.g., for "120lb" or "120磅" extract 120).'),
      reps: z.coerce.number().optional().describe('Numeric value of repetitions performed (e.g., for "10 reps" extract 10).'),
      sets: z.coerce.number().optional().describe('Numeric value of sets performed (e.g., for "3 sets" extract 3).'),
      runningTime: z.coerce.number().optional().describe('Numeric value of activity time in minutes (e.g., for "30 mins" extract 30).'),
      maxHeartRate: z.coerce.number().optional().describe('Numeric value of maximum heart rate (e.g., for "Max HR 165" extract 165).'),
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
  prompt: `You are a personal trainer. Your task is to extract structured workout data from free-text workout logs, which may be in various languages including English or Chinese.

  Analyze the workout log provided. For each exercise, extract the following information. Ensure that you extract only the numerical values for fields like weight, reps, sets, running time, and max heart rate. For example, if the log says "Bench press 120lb 3x10", you should extract weight as 120, sets as 3, and reps as 10. If it says "跑步 30 分鐘", extract runningTime as 30.

  - Exercise Name (e.g., "Bench press", "跑步")
  - Weight (in pounds, if applicable. Extract numerical value, e.g., for "120lb" or "120磅", extract 120)
  - Reps (if applicable. Extract numerical value)
  - Sets (if applicable. Extract numerical value)
  - Running Time (in minutes, if applicable. Extract numerical value, e.g., for "30 mins" or "30分鐘", extract 30)
  - Max Heart Rate (if applicable. Extract numerical value)

  Workout Log:
  {{workoutLog}}

  Return the extracted data strictly in the JSON format defined by the output schema.
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
    // If output is null (e.g. Zod parsing failed or LLM returned empty/malformed),
    // default to an empty exercises array to prevent downstream errors.
    return output || { exercises: [] };
  }
);


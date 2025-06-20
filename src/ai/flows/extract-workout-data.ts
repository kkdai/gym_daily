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
      weight: z.coerce.number().optional().describe('Numeric value of the weight used, in pounds (e.g., for "120lb" or "120磅" extract 120; for "50kg" extract 110 after conversion).'),
      reps: z.coerce.number().optional().describe('Numeric value of repetitions performed (e.g., for "10 reps" extract 10).'),
      sets: z.coerce.number().optional().describe('Numeric value of sets performed (e.g., for "3 sets" extract 3).'),
      runningTime: z.coerce.number().optional().describe('Numeric value of activity time in minutes (e.g., for "30 mins" or "30分鐘" extract 30).'),
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
  prompt: `You are a personal trainer. Your task is to extract structured workout data from free-text workout logs. These logs can be in various languages, including English or Chinese.

Your goal is to populate the following fields for each identified exercise:
- name: The name of the exercise (e.g., "Bench press", "跑步").
- weight: Numeric value of the weight used, in pounds. If the log specifies weight in kilograms (kg), convert it to pounds (1 kg = 2.2 lbs) before providing the numeric value. For example, "120lb" or "120磅" becomes 120; "50kg" becomes 110.
- reps: Numeric value of repetitions performed (e.g., "10 reps" becomes 10).
- sets: Numeric value of sets performed (e.g., "3 sets" becomes 3).
- runningTime: Numeric value of activity time in minutes (e.g., "30 mins" or "30分鐘" becomes 30).
- maxHeartRate: Numeric value of maximum heart rate (e.g., "Max HR 165" becomes 165).

Important parsing guidelines:
- Analyze the entire workout log to identify distinct exercises. Each exercise is usually on its own line or clearly separated.
- For each exercise, extract only the metrics listed above (name, weight, reps, sets, runningTime, maxHeartRate).
- Weightlifting exercises often follow a pattern like "[Exercise Name] [Weight]lb x [Reps] x [Sets]". Ensure you correctly identify reps and sets based on this structure. For example, in "胸部推舉 120lb x 8 x 7 上升", extract weight: 120, reps: 8, sets: 7. The word "上升" is a comment and should be ignored for metric extraction. Similarly, for "肩部推舉 90lb x 6 x 4", extract weight: 90, reps: 6, sets: 4.
- Ignore general commentary, summaries, or personal notes (e.g., "胸部增加，肩部就舉不動了。"; "Felt strong today.") unless they are clearly part of an exercise name or provide a specific metric. Such commentary should not affect the extraction of numerical values for any exercise.
- If an exercise line contains complex details for activities like running (e.g., "跑步 20 mins (intervals: 10 mins fast, 5 mins slow, 5 mins cool down, max HR 165)"), extract the primary/overall metrics for that exercise (e.g., for the running example, runningTime would be 20, maxHeartRate 165). Focus on total duration or explicit overall figures.
- Ensure all extracted numerical values are just numbers, without units attached in the final JSON.
- If a metric (like weight, reps, or sets) is not present for an exercise, do not include that field in the output for that exercise.

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

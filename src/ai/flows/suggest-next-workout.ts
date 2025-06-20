'use server';

/**
 * @fileOverview A workout suggestion AI agent.
 *
 * - suggestNextWorkout - A function that suggests the next workout routine.
 * - SuggestNextWorkoutInput - The input type for the suggestNextWorkout function.
 * - SuggestNextWorkoutOutput - The return type for the suggestNextWorkout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextWorkoutInputSchema = z.object({
  previousWorkoutLogs: z
    .string()
    .describe(
      'The user workout logs, including exercises, sets, reps, and weights, as a single text string.'
    ),
  fitnessGoal: z
    .string()
    .describe(
      'The fitness goal of the user, such as muscle gain, weight loss, or general fitness.'
    ),
  availableEquipment: z
    .string()
    .describe(
      'The equipment available to the user in their gym or workout space, as a single text string.'
    ),
});
export type SuggestNextWorkoutInput = z.infer<typeof SuggestNextWorkoutInputSchema>;

const SuggestNextWorkoutOutputSchema = z.object({
  suggestedWorkout: z
    .string()
    .describe('Suggested workout routine based on the previous workout logs, fitness goal, and available equipment.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested workout routine.'),
});
export type SuggestNextWorkoutOutput = z.infer<typeof SuggestNextWorkoutOutputSchema>;

export async function suggestNextWorkout(input: SuggestNextWorkoutInput): Promise<SuggestNextWorkoutOutput> {
  return suggestNextWorkoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextWorkoutPrompt',
  input: {schema: SuggestNextWorkoutInputSchema},
  output: {schema: SuggestNextWorkoutOutputSchema},
  prompt: `You are an expert fitness coach who helps users design their next workout routine.

  Based on the user's previous workout logs, fitness goal, and available equipment, suggest a workout routine for the user's next workout session.
  Explain your reasoning behind the suggestion.

  Previous Workout Logs: {{{previousWorkoutLogs}}}
  Fitness Goal: {{{fitnessGoal}}}
  Available Equipment: {{{availableEquipment}}}

  Make sure to output in the following format:

  Suggested Workout: [Suggested workout routine]
  Reasoning: [Reasoning behind the suggestion]
  `,
});

const suggestNextWorkoutFlow = ai.defineFlow(
  {
    name: 'suggestNextWorkoutFlow',
    inputSchema: SuggestNextWorkoutInputSchema,
    outputSchema: SuggestNextWorkoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

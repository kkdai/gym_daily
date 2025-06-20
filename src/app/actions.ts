'use server';
import { extractWorkoutData, type ExtractWorkoutDataInput, type ExtractWorkoutDataOutput } from '@/ai/flows/extract-workout-data';

export async function processWorkoutLogAction(input: ExtractWorkoutDataInput): Promise<ExtractWorkoutDataOutput> {
  try {
    // Simulate a short delay to show loading state
    // await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await extractWorkoutData(input);
    return result;
  } catch (error) {
    console.error("Error processing workout log:", error);
    // It's better to throw a more specific error or an error object that can be handled by the client
    throw new Error("Failed to extract workout data. The AI service might be unavailable or the input format is unexpected. Please check your input or try again later.");
  }
}

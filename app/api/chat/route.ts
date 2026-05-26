import { createGroq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY || '',
    });

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages,
      system: `You are an elite sports scientist, Olympic strength & conditioning coach, and recovery expert. 
Your goal is to optimize athlete recovery through precise macronutrient recommendations and targeted kinetic mobility prescriptions.

Guidelines:
1. Always be highly encouraging, scientific, professional, and precise.
2. If the user mentions feeling sore, fatigued, stiff, or lists a muscle group causing pain, you MUST call the 'prescribe_mobility' tool to build a customized active recovery protocol.
3. If the user discusses training load, preparing for a competition, workout intensities, or general diet planning, you MUST call the 'suggest_macros' tool to configure their nutritional model.
4. Explain your recommendations scientifically in the chat text (e.g. why certain mobility drills reduce local hypertonicity, or why carbohydrate loading supports glycogen resynthesis). Keep explanations concise and elite.`,
      tools: {
        suggest_macros: (tool as any)({
          description: 'Calculate or adjust macronutrient ratios and gram intakes based on the athlete\'s training volume and body weight.',
          parameters: z.object({
            weight: z.number().min(40).max(180).describe('Current athlete body weight in kilograms.'),
            trainingLoad: z.enum(['low', 'moderate', 'high', 'peak']).describe('Current or planned training load intensity.'),
            proteinRatio: z.number().min(15).max(65).describe('Requested protein ratio percentage (15% to 65% of macro allocation).'),
          }),
          execute: async (args: any) => {
            return { ...args, success: true };
          },
        }),
        prescribe_mobility: (tool as any)({
          description: 'Prescribe specific kinetic mobility drills and target muscle groups that need active recovery or rehabilitation.',
          parameters: z.object({
            muscleGroups: z.array(
              z.object({
                id: z.string().describe('Unique standard identifier, e.g. "quads", "lower-back", "calves", "shoulders", "hamstrings", "glutes", "neck".'),
                name: z.string().describe('Display name of the muscle group (e.g., "Quadriceps", "Lower Back", "Gastrocnemius / Calves").'),
                soreness: z.enum(['mild', 'moderate', 'severe']).describe('Soreness severity or tightness level reported.'),
                prescriptions: z.array(z.string()).describe('List of exact exercises, foam rolling protocols, stretching techniques, or active releases.'),
                durationMinutes: z.number().describe('Estimated minutes required to execute the prescription for this group.'),
              })
            ).describe('Array of targeted muscle groups that need attention.'),
          }),
          execute: async (args: any) => {
            return { ...args, success: true };
          },
        }),
      } as any,
    });

    return (result as any).toDataStreamResponse();
  } catch (error) {
    console.error('Error in Athlete Chat route:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request. Please ensure GROQ_API_KEY is configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

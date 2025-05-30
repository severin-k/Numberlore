'use server';
/**
 * @fileOverview An AI agent that fetches the cultural and historical meanings of a given number.
 *
 * - getNumberMeanings - A function that retrieves the meanings of a number.
 * - GetNumberMeaningsInput - The input type for the getNumberMeanings function.
 * - GetNumberMeaningsOutput - The return type for the getNumberMeanings function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GetNumberMeaningsInputSchema = z.object({
  number: z.number().describe('The number to retrieve meanings for.'),
});
export type GetNumberMeaningsInput = z.infer<typeof GetNumberMeaningsInputSchema>;

const GetNumberMeaningsOutputSchema = z.object({
  meanings: z.array(
    z.object({
      culture: z.string().describe('The culture or origin of the meaning.'),
      meaning: z.string().describe('The cultural or historical meaning of the number.'),
      funFact: z.string().optional().describe('A fun fact or interesting trivia about the meaning.'),
    })
  ).describe('An array of cultural and historical meanings for the number.'),
});
export type GetNumberMeaningsOutput = z.infer<typeof GetNumberMeaningsOutputSchema>;

export async function getNumberMeanings(input: GetNumberMeaningsInput): Promise<GetNumberMeaningsOutput> {
  return getNumberMeaningsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getNumberMeaningsPrompt',
  input: {
    schema: z.object({
      number: z.number().describe('The number to retrieve meanings for.'),
    }),
  },
  output: {
    schema: z.object({
      meanings: z.array(
        z.object({
          culture: z.string().describe('The culture or origin of the meaning.'),
          meaning: z.string().describe('The cultural or historical meaning of the number.'),
          funFact: z.string().optional().describe('A fun fact or interesting trivia about the meaning.'),
        })
      ).describe('An array of cultural and historical meanings for the number.'),
    }),
  },
  prompt: `You are an expert in cultural and historical number meanings.

  Provide interesting and funny meanings for the number {{number}}, including historical context.

  Format the output as a JSON array of objects, with each object containing the culture, meaning, and a fun fact (if available).
  `,
});

const getNumberMeaningsFlow = ai.defineFlow<
  typeof GetNumberMeaningsInputSchema,
  typeof GetNumberMeaningsOutputSchema
>({
  name: 'getNumberMeaningsFlow',
  inputSchema: GetNumberMeaningsInputSchema,
  outputSchema: GetNumberMeaningsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});

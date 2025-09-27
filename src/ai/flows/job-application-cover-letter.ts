'use server';

/**
 * @fileOverview Determines if a cover letter is needed for a job application and prompts the user if necessary.
 *
 * - shouldPromptForCoverLetter - A function that determines whether to prompt for a cover letter.
 * - ShouldPromptForCoverLetterInput - The input type for the shouldPromptForCoverLetter function.
 * - ShouldPromptForCoverLetterOutput - The return type for the shouldPromptForCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ShouldPromptForCoverLetterInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job.'),
  jobRequirements: z.array(z.string()).describe('The requirements for the job.'),
});
export type ShouldPromptForCoverLetterInput = z.infer<
  typeof ShouldPromptForCoverLetterInputSchema
>;

const ShouldPromptForCoverLetterOutputSchema = z.object({
  shouldPrompt: z
    .boolean()
    .describe(
      'Whether or not the user should be prompted to provide a cover letter.'
    ),
});
export type ShouldPromptForCoverLetterOutput = z.infer<
  typeof ShouldPromptForCoverLetterOutputSchema
>;

export async function shouldPromptForCoverLetter(
  input: ShouldPromptForCoverLetterInput
): Promise<ShouldPromptForCoverLetterOutput> {
  return shouldPromptForCoverLetterFlow(input);
}

const coverLetterPrompt = ai.definePrompt({
  name: 'coverLetterPrompt',
  input: {
    schema: ShouldPromptForCoverLetterInputSchema,
  },
  output: {
    schema: ShouldPromptForCoverLetterOutputSchema,
  },
  prompt: `You are an AI assistant helping users apply for jobs. Your task is to determine, based on the job description and requirements, whether a cover letter is highly recommended to increase the applicant's chances of getting the job.

Consider factors such as whether the job description emphasizes communication skills, specific experience, or a high degree of personalization. Also consider if any of the job requirements ask for specific years of experience or certain qualifications.

Respond with ONLY a JSON object. The "shouldPrompt" field should be set to true if a cover letter is recommended, and false otherwise.

Job Description: {{{jobDescription}}}
Job Requirements: {{#each jobRequirements}}- {{{this}}}{{/each}}`,
});

const shouldPromptForCoverLetterFlow = ai.defineFlow(
  {
    name: 'shouldPromptForCoverLetterFlow',
    inputSchema: ShouldPromptForCoverLetterInputSchema,
    outputSchema: ShouldPromptForCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await coverLetterPrompt(input);
    return output!;
  }
);

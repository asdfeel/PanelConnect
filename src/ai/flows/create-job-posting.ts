'use server';

/**
 * @fileOverview Creates a job posting using AI.
 *
 * - createJobPosting - A function that generates job posting details.
 * - CreateJobPostingInput - The input type for the createJobPosting function.
 * - CreateJobPostingOutput - The return type for the createJobPosting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateJobPostingInputSchema = z.object({
  title: z.string().describe('The title of the job.'),
  company: z.string().describe('The name of the company.'),
});
export type CreateJobPostingInput = z.infer<typeof CreateJobPostingInputSchema>;

const CreateJobPostingOutputSchema = z.object({
  description: z.string().describe("The detailed description of the job."),
  requirements: z.array(z.string()).describe("A list of requirements for the job."),
});
export type CreateJobPostingOutput = z.infer<typeof CreateJobPostingOutputSchema>;

export async function createJobPosting(
  input: CreateJobPostingInput
): Promise<CreateJobPostingOutput> {
  return createJobPostingFlow(input);
}

const jobPostingPrompt = ai.definePrompt({
  name: 'jobPostingPrompt',
  input: {
    schema: CreateJobPostingInputSchema,
  },
  output: {
    schema: CreateJobPostingOutputSchema,
  },
  prompt: `You are an expert HR manager. Based on the provided job title and company, generate a compelling and professional job posting.
The output should be in Korean.

Create a detailed job description and a list of requirements.
The tone should be professional yet inviting.

Job Title: {{{title}}}
Company: {{{company}}}

Generate a JSON object with 'description' and 'requirements' fields.
- The 'description' should be a single string.
- The 'requirements' should be an array of strings.`,
});

const createJobPostingFlow = ai.defineFlow(
  {
    name: 'createJobPostingFlow',
    inputSchema: CreateJobPostingInputSchema,
    outputSchema: CreateJobPostingOutputSchema,
  },
  async input => {
    const {output} = await jobPostingPrompt(input);
    return output!;
  }
);

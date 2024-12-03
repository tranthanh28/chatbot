import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export default defineLazyEventHandler(async () => {
    const apiKey = useRuntimeConfig().openaiApiKey;
    if (!apiKey) throw new Error('Missing OpenAI API key');
    const openai = createOpenAI({
        apiKey: apiKey,
    });

    return defineEventHandler(async (event: any) => {
        const { messages } = await readBody(event);

        // const result = streamText({
        //     model: openai('gpt-4o'),
        //     messages,
        //     tools: {
        //         weather: tool({
        //             description: 'Get the weather in a location (farenheit)',
        //             parameters: z.object({
        //                 location: z
        //                     .string()
        //                     .describe('The location to get the weather for'),
        //             }),
        //             execute: async ({ location }) => {
        //                 const temperature = Math.round(Math.random() * (90 - 32) + 32);
        //                 return {
        //                     location,
        //                     temperature,
        //                 };
        //             },
        //         }),
        //     },
        // });

        // return result.toDataStreamResponse();
        return {"data": "day la cau tra loi"};
    });
});
import { PipelinePromptTemplate, PromptTemplate } from 'langchain/prompts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function extendAIFunction(
    aiFunc: PromptTemplate,
    funcInput: PromptTemplate,
): PipelinePromptTemplate<any> {
    const fullPrompt = PromptTemplate.fromTemplate(`{aiFunc}
INSTRUCTIONS: You are a function printer. You ONLY print the results of functions.
Nothing else.  No commentary.  Print out what the function will return.
Here is the input to the function: 
INPUT: {funcInput}. `);

    const composedPrompt = new PipelinePromptTemplate({
        pipelinePrompts: [
            {
                name: 'aiFunc',
                prompt: aiFunc,
            },
            {
                name: 'funcInput',
                prompt: funcInput,
            },
        ],
        finalPrompt: fullPrompt,
    });

    return composedPrompt;
}

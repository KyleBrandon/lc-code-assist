import { PromptTemplate } from 'langchain/prompts';
import { printProjectScope } from '../../src/ai_functions/aifunc_architect';
import { convertUserInputToGoal } from '../../src/ai_functions/aifunc_managing';
import {
    printBackendWebserverCode,
    printImprovedWebServerCode,
    printFixedCode,
    printRestAPIEndpoints,
} from '../../src/ai_functions/aifunc_backend';
import { extendAIFunction } from '../../src/helpers/general';

describe('Ensure that the Architect AI funcs compose correctly', () => {
    test('Extend printProjectScope', async () => {
        const prompt = extendAIFunction(
            printProjectScope,
            PromptTemplate.fromTemplate('dummy input'),
        );

        const formattedPrompt = await prompt.format({});
        // Ensure that the extendAIFunction combined our prompts
        expect(formattedPrompt).toContain('INPUT: dummy input');
    });

    test('Extend printSiteUrls', async () => {
        const prompt = extendAIFunction(
            printProjectScope,
            PromptTemplate.fromTemplate('dummy input'),
        );

        const formattedPrompt = await prompt.format({});
        // Ensure that the extendAIFunction combined our prompts
        expect(formattedPrompt).toContain('INPUT: dummy input');
    });
});

describe('Ensure that the Backend AI funcs compose correctly', () => {
    test('Extend printBackendWebserverCode', async () => {
        const prompt = extendAIFunction(
            printBackendWebserverCode,
            PromptTemplate.fromTemplate('dummy input'),
        );

        const formattedPrompt = await prompt.format({});
        // Ensure that the extendAIFunction combined our prompts
        expect(formattedPrompt).toContain('INPUT: dummy input');
    });

    test('Extend printImprovedWebServerCode', async () => {
        const prompt = extendAIFunction(
            printImprovedWebServerCode,
            PromptTemplate.fromTemplate('dummy input'),
        );

        const formattedPrompt = await prompt.format({});
        // Ensure that the extendAIFunction combined our prompts
        expect(formattedPrompt).toContain('INPUT: dummy input');
    });

    test('Extend printFixedCode', async () => {
        const prompt = extendAIFunction(
            printFixedCode,
            PromptTemplate.fromTemplate('dummy input'),
        );

        const formattedPrompt = await prompt.format({});
        // Ensure that the extendAIFunction combined our prompts
        expect(formattedPrompt).toContain('INPUT: dummy input');
    });

    test('Extend printRestApiEndpoints', async () => {
        const prompt = extendAIFunction(
            printRestAPIEndpoints,
            PromptTemplate.fromTemplate('dummy input'),
        );

        const formattedPrompt = await prompt.format({});
        // Ensure that the extendAIFunction combined our prompts
        expect(formattedPrompt).toContain('INPUT: dummy input');
    });
});

describe('Ensure that the Managing AI funcs compose correctly', () => {
    test('Extend convertUserInputToGoal', async () => {
        const prompt = extendAIFunction(
            convertUserInputToGoal,
            PromptTemplate.fromTemplate('dummy input'),
        );

        const formattedPrompt = await prompt.format({});

        // Ensure that the extendAIFunction combined our prompts
        expect(formattedPrompt).toContain('INPUT: dummy input');
    });
});

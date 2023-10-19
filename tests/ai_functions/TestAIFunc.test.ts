import { printProjectScope } from '../../src/ai_functions/aifunc_architect';
import { convertUserInputToGoal } from '../../src/ai_functions/aifunc_managing';
import {
    printBackendWebserverCode,
    printImprovedWebServerCode,
    printFixedCode,
    printRestAPIEndpoints,
} from '../../src/ai_functions/aifunc_backend';
import {
    aiTaskRequest,
    getSystemMessagePrompt,
} from '../../src/helpers/general';

describe('Ensure that the Architect AI funcs compose correctly', () => {
    test('Extend printProjectScope', () => {
        const prompt = getSystemMessagePrompt(printProjectScope);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(prompt.lc_kwargs.prompt.template.length).toBeGreaterThan(20);
    });

    test('Extend printSiteUrls', () => {
        const prompt = getSystemMessagePrompt(printProjectScope);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(prompt.lc_kwargs.prompt.template.length).toBeGreaterThan(20);
    });
});

describe('Ensure that the Backend AI funcs compose correctly', () => {
    test('Extend printBackendWebserverCode', () => {
        const prompt = getSystemMessagePrompt(printBackendWebserverCode);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(prompt.lc_kwargs.prompt.template.length).toBeGreaterThan(20);
    });

    test('Extend printImprovedWebServerCode', () => {
        const prompt = getSystemMessagePrompt(printImprovedWebServerCode);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(prompt.lc_kwargs.prompt.template.length).toBeGreaterThan(20);
    });

    test('Extend printFixedCode', () => {
        const prompt = getSystemMessagePrompt(printFixedCode);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(prompt.lc_kwargs.prompt.template.length).toBeGreaterThan(20);
    });

    test('Extend printRestApiEndpoints', () => {
        const prompt = getSystemMessagePrompt(printRestAPIEndpoints);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(prompt.lc_kwargs.prompt.template.length).toBeGreaterThan(20);
    });
});

describe('Ensure that the Managing AI funcs compose correctly', () => {
    test('Extend convertUserInputToGoal', () => {
        const prompt = getSystemMessagePrompt(convertUserInputToGoal);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(prompt.lc_kwargs.prompt.template).toContain(
            'FUNCTION: convertUserInputToGoal',
        );
    });
});

describe('Ensure aiTaskRequest is built correctly', () => {
    test('Build AI Task', async () => {
        const messageContext =
            'Build me a webserver for making stock price api requests';
        const result = await aiTaskRequest(
            messageContext,
            'Managing Agent',
            'Defining user requirements',
            convertUserInputToGoal,
        );

        expect(result.length).toBeGreaterThan(10);
    });
});

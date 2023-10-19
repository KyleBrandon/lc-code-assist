import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { PrintCommand, CommandLine } from './CommandLine';
import { ChatLLM } from '../apis/ChatLLM';
import fs from 'node:fs';

const CODE_TEMPLATE_PATH: string =
    '/Users/kyle/workspaces/rust/rust_autogpt/web_template/src/code_template.rs';
const EXECUTE_MAIN_PATH: string =
    '/Users/kyle/workspaces/rust/rust_autogpt/web_template/src/main.rs';
const API_SCHEMA_PATH: string =
    '/Users/kyle/workspaces/rust/rust_autogpt/auto_gippity/schemas/api_schema.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getSystemMessagePrompt(
    aiFunc: string,
): SystemMessagePromptTemplate {
    const prompt = SystemMessagePromptTemplate.fromTemplate(`FUNCTION: ${aiFunc}
INSTRUCTIONS: You are a function printer. You ONLY print the results of functions.
Nothing else.  No commentary.  Print out what the function will return.`);

    return prompt;
}

// Performs a call to LLM GPT
export async function aiTaskRequest(
    messageContext: string,
    agentPosition: string,
    agentOperation: string,
    functionPass: string,
): Promise<string> {
    CommandLine.printAgentMessage(
        PrintCommand.AICall,
        agentPosition,
        agentOperation,
    );

    // Builds the extended AI function
    const systemMessagePrompt = getSystemMessagePrompt(functionPass);
    const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
        'Here is the input to the function: {input}. Print out what the function will return.',
    );

    const chatPrompt = ChatPromptTemplate.fromMessages([
        systemMessagePrompt,
        humanMessagePrompt,
    ]);

    // Get LLM response
    const llm = new ChatLLM({ prompt: chatPrompt });
    const result = await llm.send({
        input: messageContext,
    });

    return result;
}

// Performs call to LLM GPT - Decoded
export async function aiTaskRequestDecoded<T>(
    messageContext: string,
    agentPosition: string,
    agentOperation: string,
    functionPass: string,
): Promise<T> {
    const response = await aiTaskRequest(
        messageContext,
        agentPosition,
        agentOperation,
        functionPass,
    );

    const deserializedResponse: T = JSON.parse(response);
    return deserializedResponse;
}

// Check whether request url is valid
export async function checkURLStatusCode(url: string): Promise<number> {
    const result = await fetch(url);
    return result.status;
}

function readFile(path: string): string {
    return fs.readFileSync(path, 'utf8');
}

function writeFile(path: string, contents: string): void {
    fs.writeFileSync(path, contents);
}

// Get Code Template
export function readCodeTemplate(): string {
    return readFile(CODE_TEMPLATE_PATH);
}

// Get Exec Main
export function readExecMain(): string {
    return readFile(EXECUTE_MAIN_PATH);
}

// Save New Backend Code
export function saveBackendCode(contents: string) {
    writeFile(EXECUTE_MAIN_PATH, contents);
}

// Save JSON API Endpoint Schema
export function saveAPIEndpoints(apiEndpoints: string) {
    writeFile(API_SCHEMA_PATH, apiEndpoints);
}

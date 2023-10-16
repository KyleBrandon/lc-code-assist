import 'dotenv/config';
import { OpenAI } from 'langchain/llms/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChainValues } from 'langchain/dist/schema';

const DEFAULT_MODEL = 'gpt-3.5-turbo';
const DEFAULT_TEMPERATURE = 0.0;

export interface ChatLLMConfig {
    openAIApiKey: string;
    temperature: number;
    modelName: string;
}

export class ChatLLM {
    #_chain: ConversationChain;

    get chain() {
        return this.#_chain;
    }

    constructor(config: Partial<ChatLLMConfig> = {}) {
        this.validateConfig(config);

        const model = new OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0.0,
            modelName: 'gpt-3.5-turbo',
        });

        const memory = new BufferMemory();
        this.#_chain = new ConversationChain({ llm: model, memory });
    }

    public async send(prompt: string): Promise<ChainValues> {
        const response = await this.chain.call({
            input: prompt,
        });

        return response.response;
    }

    private validateConfig(config: Partial<ChatLLMConfig>) {
        if (!config.openAIApiKey) {
            config.openAIApiKey = process.env.OPENAI_API_KEY;
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set');
        }
        if (!config.temperature) {
            config.temperature = DEFAULT_TEMPERATURE;
        }
        if (!config.modelName) {
            config.modelName = DEFAULT_MODEL;
        }
    }
}

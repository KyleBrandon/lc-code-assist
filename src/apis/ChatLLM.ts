import 'dotenv/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import { ChainValues } from 'langchain/dist/schema';
import { ChatPromptTemplate } from 'langchain/prompts';

const DEFAULT_MODEL = 'gpt-3.5-turbo';
const DEFAULT_TEMPERATURE = 0.0;

export interface ChatLLMConfig {
    openAIApiKey: string;
    temperature: number;
    modelName: string;
    prompt: ChatPromptTemplate;
}

export class ChatLLM {
    #_chain: LLMChain;
    #_model: ChatOpenAI;

    get chain() {
        return this.#_chain;
    }

    constructor(config: Partial<ChatLLMConfig> = {}) {
        this.validateConfig(config);

        this.#_model = new ChatOpenAI({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            openAIApiKey: config.openAIApiKey,
            temperature: config.temperature,
            modelName: config.modelName,
        });

        this.#_chain = new LLMChain({
            llm: this.#_model,
            prompt: config.prompt!,
        });
    }

    public async send(input: ChainValues): Promise<string> {
        try {
            const response = await this.chain.call(input);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response.text;
        } catch (error) {
            try {
                const response = await this.chain.call(input);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return response.text;
            } catch (error) {
                if (error) {
                    throw new Error('Failed twice calling the LLM', error);
                } else {
                    throw error;
                }
            }
        }
    }

    private validateConfig(config: Partial<ChatLLMConfig>) {
        if (!config.openAIApiKey) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            config.openAIApiKey = process.env.OPENAI_API_KEY;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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

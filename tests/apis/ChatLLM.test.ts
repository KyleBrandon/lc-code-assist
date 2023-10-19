import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { ChatLLM } from '../../src/apis/ChatLLM';

describe('ChatLLM', () => {
    test('Ensure chat works with raw LangChain API', async () => {
        const systemMessage = SystemMessagePromptTemplate.fromTemplate(
            'You are a helpful assistant that translates {input_language} to {output_language}.',
        );
        const humanMessage = HumanMessagePromptTemplate.fromTemplate('{text}');

        const chatPrompt = ChatPromptTemplate.fromMessages([
            systemMessage,
            humanMessage,
        ]);

        const chat = new ChatOpenAI({
            temperature: 0,
        });

        const chain = new LLMChain({
            llm: chat,
            prompt: chatPrompt,
        });

        const result = await chain.call({
            input_language: 'English',
            output_language: 'Spanish',
            text: 'I love programming',
        });

        expect(result.text).toEqual('Amo programar');
    });

    test('Send chat with ChatLLM wrapper', async () => {
        const systemMessage = SystemMessagePromptTemplate.fromTemplate(
            'You are a helpful assistant that translates {input_language} to {output_language}.',
        );
        const humanMessage = HumanMessagePromptTemplate.fromTemplate('{text}');

        const chatPrompt = ChatPromptTemplate.fromMessages([
            systemMessage,
            humanMessage,
        ]);

        const llm = new ChatLLM({
            temperature: 0.0,
            prompt: chatPrompt,
        });

        const result = await llm.send({
            input_language: 'English',
            output_language: 'Spanish',
            text: 'I love programming',
        });
        expect(result).toEqual('Amo programar');
    });
});

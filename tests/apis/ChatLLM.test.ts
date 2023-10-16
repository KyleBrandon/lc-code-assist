import { ChatLLM } from '../../src/apis/ChatLLM';

describe('ChatLLM', () => {
    test('Create simple prompt and send to Chat LLM', async () => {
        const chat = new ChatLLM();
        const response = await chat.send('hello');
        expect(response.toLowerCase()).toContain('hello');
    });

    test('Ensure chat responds with state', async () => {
        const chat: ChatLLM = new ChatLLM();
        let response = await chat.send('Hello my name is Kyle');
        expect(response.length).toBeGreaterThan(0);
        response = await chat.send('Who am I?');
        expect(response.toLowerCase()).toContain('kyle');
    });
});

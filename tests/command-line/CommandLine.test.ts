import { PrintCommand, CommandLine } from '../../src/helpers/CommandLine';

describe('CommandLine', () => {
    test('Print AICall Command', () => {
        const cmdLine = new CommandLine();
        cmdLine.printAgentMessage(
            PrintCommand.AICall,
            'Managing Agent',
            'Testing testing',
        );
    });
});

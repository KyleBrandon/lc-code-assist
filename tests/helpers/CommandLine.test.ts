import { PrintCommand, CommandLine } from '../../src/helpers/CommandLine';

describe('CommandLine', () => {
    test('Print AICall Command', () => {
        CommandLine.printAgentMessage(
            PrintCommand.AICall,
            'Managing Agent',
            'Testing testing',
        );
    });
});

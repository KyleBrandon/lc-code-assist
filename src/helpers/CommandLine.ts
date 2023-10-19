import PromptSync from 'prompt-sync';
import chalk from 'chalk';
const prompt = PromptSync();

export enum PrintCommand {
    AICall,
    UnitTest,
    Issue,
}

export class CommandLine {
    /// Get the user request.
    //
    public static getUserResponse(question: string): string {
        let answer = prompt(chalk.blue(question));
        if (!answer) {
            answer = 'Invalid answer';
        }
        return answer;
    }

    public static printAgentMessage(
        command: PrintCommand,
        agentPosition: string,
        agentStatement: string,
    ): void {
        // Get the color for the 'command'
        const printInColor = CommandLine.getStatementColor(command);

        // Print the agent position in green and the agent statement in the command color
        console.log(
            chalk.green(`Agent: ${agentPosition}: `) +
                printInColor(agentStatement),
        );
    }

    private static getStatementColor(
        command: PrintCommand,
    ): (output: string) => string {
        if (command === PrintCommand.Issue) {
            return chalk.red;
        } else if (command === PrintCommand.UnitTest) {
            return chalk.magenta;
        } else {
            return chalk.cyan;
        }
    }
}

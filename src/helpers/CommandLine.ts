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
    public getUserResponse(question: string): string {
        console.log(chalk.blue);
        let answer = prompt(chalk.blue(question));
        if (!answer) {
            answer = 'Invalid answer';
        }
        return answer;
    }

    public printAgentMessage(
        command: PrintCommand,
        agentPosition: string,
        agentStatement: string,
    ): void {
        // Print the agent position in green
        console.log(chalk.green(`Agent: ${agentPosition}`));

        const printInColor = this.getStatementColor(command);
        console.log(printInColor(agentStatement));

        // Print the agent statement in the specified color
        console.log();
    }

    private getStatementColor(
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

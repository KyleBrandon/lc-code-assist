import { CommandLine } from './helpers/CommandLine';

function main() {
    const cmdLine = new CommandLine();

    const response = cmdLine.getUserResponse(
        'What webserver are we building today? ',
    );

    console.log();
}

main();

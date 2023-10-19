import { CommandLine } from './helpers/CommandLine';

function main() {
    const response = CommandLine.getUserResponse(
        'What webserver are we building today? ',
    );

    console.log(response);
}

main();

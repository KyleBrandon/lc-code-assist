import { CommandLine } from './helpers/CommandLine';
import { ManagingAgent } from './models/ManagingAgent';

async function main() {
    const userRequest = CommandLine.getUserResponse(
        'What website are we building today? ',
    );

    const agent = await ManagingAgent.new(userRequest);

    await agent.executeProject();
}

main()
    .then(() => {
        console.log('Finished building the website.');
    })
    .catch((error) => {
        console.log(error);
    });

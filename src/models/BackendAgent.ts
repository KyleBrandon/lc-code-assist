import {
    printBackendWebserverCode,
    printImprovedWebServerCode,
    printFixedCode,
    printRestAPIEndpoints,
} from '../ai_functions/aifunc_backend';
import {
    execCargoBuild,
    execCargoRun,
    ExecResponse,
    readCodeTemplate,
    readExecMain,
    saveBackendCode,
    deserialize,
    sleep,
    saveAPIEndpoints,
} from '../helpers/general';
import { CommandLine, PrintCommand } from '../helpers/CommandLine';
import { aiTaskRequest, checkURLStatusCode } from '../helpers/general';
import {
    AgentState,
    BasicAgent,
    DynamicAgent,
    FactSheet,
    RouteObject,
} from './BasicAgent';

export class BackendAgent extends BasicAgent implements DynamicAgent {
    bugErrors?: string;
    bugCount: number;
    forceAcceptUserPrompt: boolean;

    public constructor() {
        super(
            'Develops the backend code for webserver and jsonn database',
            'Backend Developer',
        );

        this.bugCount = 0;
        this.forceAcceptUserPrompt = false;
    }

    async callInitialBackendCode(factsheet: FactSheet): Promise<void> {
        const codeTemplate = readCodeTemplate();
        const projectDescription = factsheet.projectDescription;
        const messageContext = `CODE TEMPLATE: ${codeTemplate} \n PROJECT_DESCRIPTION: ${projectDescription} \n`;

        const response = await aiTaskRequest(
            messageContext,
            this.position,
            'printBackendWebserverCode',
            printBackendWebserverCode,
        );

        saveBackendCode(response);
        factsheet.backendCode = response;
    }

    async improveBackendCode(factsheet: FactSheet): Promise<void> {
        const codeTemplate = factsheet.backendCode;
        const projectDescription = JSON.stringify(factsheet);
        const messageContext = `CODE TEMPLATE: ${codeTemplate} \n PROJECT_DESCRIPTION: ${projectDescription} \n`;

        const response = await aiTaskRequest(
            messageContext,
            this.position,
            'printImprovedWebServerCode',
            printImprovedWebServerCode,
        );

        saveBackendCode(response);
        factsheet.backendCode = response;
    }

    async fixCodeBugs(factsheet: FactSheet): Promise<void> {
        const codeTemplate = factsheet.backendCode;
        const bugErrors = this.bugErrors;
        const messageContext = `BROKEN_CODE: ${codeTemplate} \n ERROR_BUGS: ${bugErrors} \n`;

        const response = await aiTaskRequest(
            messageContext,
            this.position,
            'printFixedCode',
            printFixedCode,
        );

        saveBackendCode(response);
        factsheet.backendCode = response;
    }

    async callExtractRestApiEndpoints(): Promise<string> {
        const backendCode = readExecMain();
        const messageContext = `CODE_INPUT: ${backendCode}`;
        const response = await aiTaskRequest(
            messageContext,
            this.position,
            'printRestAPIEndpoints',
            printRestAPIEndpoints,
        );

        return response;
    }

    // Handle the BackendAgent in a Discovery state.
    //  - call the AI to create the backend code
    //  - transition to the Working state
    async processDiscoveryState(factsheet: FactSheet): Promise<void> {
        await this.callInitialBackendCode(factsheet);
        this.state = AgentState.Working;
    }

    // Handle the BackendAgent Working state
    //  - either improve the initial version of the backend code or fix any detected bugs
    //  - transition to the UnitTesting state
    async processWorkingState(factsheet: FactSheet): Promise<void> {
        if (this.bugCount === 0) {
            await this.improveBackendCode(factsheet);
        } else {
            await this.fixCodeBugs(factsheet);
        }
        this.state = AgentState.UnitTesting;
    }

    processUnitTestingPrompt(): void {
        // Guard - ensure AI safety
        CommandLine.printAgentMessage(
            PrintCommand.UnitTest,
            this.position,
            'Backend Code Unit Testing: Requesting user input',
        );

        // force acceptance of user prompts - useful for scripting
        if (!this.forceAcceptUserPrompt) {
            const isSafeCode = CommandLine.confirmSafeCode();
            if (!isSafeCode) {
                throw new Error('Better go work on AI alignment');
            }
        }
        // Build and Test code

        CommandLine.printAgentMessage(
            PrintCommand.UnitTest,
            this.position,
            'Backend Code Unit Testing: Building  project...',
        );
    }

    async testCodeBuild(): Promise<boolean> {
        try {
            await execCargoBuild();
            console.log('build successful');
            // build was successful
            this.bugCount = 0;
            CommandLine.printAgentMessage(
                PrintCommand.UnitTest,
                this.position,
                'Backend Code Unit Testing: Test server build successful...',
            );

            return true;
        } catch (error) {
            const message = (error as ExecResponse).message;
            this.bugCount++;
            this.bugErrors = message;
            if (this.bugCount > 2) {
                CommandLine.printAgentMessage(
                    PrintCommand.Issue,
                    this.position,
                    'Backend Code Unit Testing: Too many bugs found in code',
                );
                throw new Error('Error: Too many bugs');
            }

            this.state = AgentState.Working;
            return false;
        }
    }

    filterEndpointsByGet(extractedEndpoints: string): RouteObject[] {
        const endpoints: RouteObject[] =
            deserialize<RouteObject[]>(extractedEndpoints);

        const filteredEndpoints = endpoints.filter(
            (o) => o.method === 'get' && o.is_route_dynamic === false,
        );

        return filteredEndpoints;
    }

    async testEndpoints(filteredEndpoints: RouteObject[]): Promise<void> {
        // Check status code
        for (const endpoint of filteredEndpoints) {
            // Confirm URL testing
            const endpointRouteString = JSON.stringify(endpoint.route);
            CommandLine.printAgentMessage(
                PrintCommand.UnitTest,
                this.position,
                `Testing endpoint: '${endpointRouteString}'...`,
            );

            // Test webserver URL
            const statusCode = await checkURLStatusCode(
                `http://localhost:8080${endpointRouteString}`,
            );
            if (statusCode != 200) {
                CommandLine.printAgentMessage(
                    PrintCommand.Issue,
                    this.position,
                    `WARNING: Failed to call backend URL endpoint ${endpointRouteString}`,
                );
            }
        }
    }

    public async execute(factsheet: FactSheet): Promise<void> {
        while (this.state != AgentState.Finished) {
            switch (this.state) {
                case AgentState.Discovery:
                    {
                        console.log('BackendAgent: Discovery');
                        await this.processDiscoveryState(factsheet);
                    }
                    break;

                case AgentState.Working:
                    {
                        console.log('BackendAgent: Working');
                        await this.processWorkingState(factsheet);
                    }
                    break;

                case AgentState.UnitTesting:
                    {
                        console.log('BackendAgent: UnitTesting');
                        this.processUnitTestingPrompt();

                        const success: boolean = await this.testCodeBuild();
                        if (!success) {
                            continue;
                        }

                        // Extract API Endpoints
                        const extractedEndpoints =
                            await this.callExtractRestApiEndpoints();

                        const filteredEndpoints =
                            this.filterEndpointsByGet(extractedEndpoints);

                        // Store API Endpoints
                        factsheet.apiEndpointSchema = filteredEndpoints;

                        // Run backend application
                        CommandLine.printAgentMessage(
                            PrintCommand.UnitTest,
                            this.position,
                            'Backend Code Unit Testing: Starting web server...',
                        );

                        // Start the AI generated web server
                        const runResult = await execCargoRun();

                        // Let user know testing on server will take place soon
                        CommandLine.printAgentMessage(
                            PrintCommand.UnitTest,
                            this.position,
                            'Backend Code Unit Testing: Launching tests on server in 5 seconds...',
                        );

                        await sleep(5000);

                        try {
                            await this.testEndpoints(filteredEndpoints);
                        } catch (error) {
                            if (runResult.child) {
                                runResult.child.kill();
                            }

                            const message = (error as Error).message;

                            CommandLine.printAgentMessage(
                                PrintCommand.Issue,
                                this.position,
                                `ERROR: Failed to check backend server: ${message}`,
                            );
                        }

                        saveAPIEndpoints(extractedEndpoints);
                        CommandLine.printAgentMessage(
                            PrintCommand.UnitTest,
                            this.position,
                            'Backend testing complete...',
                        );

                        if (runResult.child) {
                            runResult.child.kill();
                        }
                        this.state = AgentState.Finished;
                    }
                    break;
            }
        }
    }
}

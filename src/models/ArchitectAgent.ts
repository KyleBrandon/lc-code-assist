import {
    printProjectScope,
    printSiteUrls,
} from '../ai_functions/aifunc_architect';
import { CommandLine, PrintCommand } from '../helpers/CommandLine';
import { aiTaskRequestDecoded, checkURLStatusCode } from '../helpers/general';
import { AgentState, BasicAgent, FactSheet, ProjectScope } from './BasicAgent';

export class ArchitectAgent extends BasicAgent {
    public constructor() {
        super(
            'Gathers information and design solutions for website development',
            'Solutions Architect',
        );
    }

    // Retrieve Project ProjectScope
    public async callProjectScope(factsheet: FactSheet): Promise<ProjectScope> {
        const messageContext = factsheet.projectDescription;

        const response = await aiTaskRequestDecoded<ProjectScope>(
            messageContext,
            this.position,
            'printProjectScope',
            printProjectScope,
        );

        factsheet.projectScope = response;
        this.state = AgentState.Finished;
        return response;
    }

    public async callDetermineExternalUrls(
        factsheet: FactSheet,
        messageContext: string,
    ) {
        const response = await aiTaskRequestDecoded<string[]>(
            messageContext,
            this.position,
            'printSiteUrls',
            printSiteUrls,
        );

        factsheet.externalURLs = response;
        this.state = AgentState.UnitTesting;
    }

    public async execute(factsheet: FactSheet): Promise<void> {
        while (this.state != AgentState.Finished) {
            switch (this.state) {
                case AgentState.Discovery:
                    {
                        const projectScope =
                            await this.callProjectScope(factsheet);

                        if (projectScope.is_external_urls_required) {
                            await this.callDetermineExternalUrls(
                                factsheet,
                                factsheet.projectDescription,
                            );
                            this.state = AgentState.UnitTesting;
                        }
                    }
                    break;

                case AgentState.UnitTesting:
                    {
                        const externalURLs: string[] =
                            factsheet.externalURLs ?? [];
                        const excludeUrls: string[] = [];
                        for (const url of externalURLs) {
                            const endpointString = `Testing URL Endpoint ${url}`;
                            CommandLine.printAgentMessage(
                                PrintCommand.UnitTest,
                                this.position,
                                endpointString,
                            );

                            try {
                                const statusCode =
                                    await checkURLStatusCode(url);
                                if (statusCode != 200) {
                                    excludeUrls.push(url);
                                }
                            } catch (error) {
                                console.log(`Error checking ${url}`);
                                if (error) {
                                    console.log(error);
                                }
                            }
                        }

                        // remove the excluded URLs from the verified list
                        if (excludeUrls.length > 0) {
                            if (externalURLs) {
                                const verifiedUrls = externalURLs.filter(
                                    (u: string) => !excludeUrls.includes(u),
                                );

                                // update the factsheet with the new list of verified URLs
                                factsheet.externalURLs = verifiedUrls;
                            }
                        }

                        // Confirm done
                        this.state = AgentState.Finished;
                    }

                    break;

                default:
                    this.state = AgentState.Finished;
            }
        }
    }
}

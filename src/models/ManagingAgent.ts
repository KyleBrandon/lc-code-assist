import { aiTaskRequest } from '../helpers/general';
import { ArchitectAgent } from '../models/ArchitectAgent';
import { convertUserInputToGoal } from '../ai_functions/aifunc_managing';
import { BasicAgent, DynamicAgent, FactSheet } from './BasicAgent';

// TODO refactor to remove BasicAgent
export class ManagingAgent extends BasicAgent {
    static POSITION = 'Project Manager';
    public factsheet: FactSheet;
    public agents: DynamicAgent[];

    public constructor(projectDescription: string) {
        super(
            'Manage agents who are building an excellent website for the user',
            ManagingAgent.POSITION,
        );

        this.factsheet = {
            projectDescription,
        };

        this.agents = [];
    }

    public static async new(userRequest: string): Promise<ManagingAgent> {
        const projectDescription = await aiTaskRequest(
            userRequest,
            ManagingAgent.POSITION,
            'convertUserInputToGoal',
            convertUserInputToGoal,
        );

        const agent = new ManagingAgent(projectDescription);

        return agent;
    }

    private addAgent(agent: DynamicAgent): void {
        this.agents.push(agent);
    }

    private createAgents(): void {
        this.addAgent(new ArchitectAgent());
        // TODO: add backend agent
    }

    public async executeProject(): Promise<void> {
        this.createAgents();
        for (const agent of this.agents) {
            const response = await agent.execute(this.factsheet);
        }
    }
}

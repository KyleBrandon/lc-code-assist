import { ArchitectAgent } from '../../src/models/ArchitectAgent';
import { AgentState, FactSheet } from '../../src/models/BasicAgent';

describe('ArchitectAgent Tests', () => {
    test('Architect a CRUD site', async () => {
        const agent: ArchitectAgent = new ArchitectAgent();
        const factsheet: FactSheet = {
            projectDescription:
                'Build a website that will allow me to create and view tasks and allow for updating and deleting them as well.',
        };

        expect(agent.state).toEqual(AgentState.Discovery);
        await agent.execute(factsheet);
        expect(agent.state).toEqual(AgentState.Finished);
        expect(factsheet.projectScope?.is_crud_required).toBeTruthy();
    });
    test('Architect a site with authentication', async () => {
        const agent: ArchitectAgent = new ArchitectAgent();
        const factsheet: FactSheet = {
            projectDescription:
                'Build a website that will allow me to login and save my user profile.',
        };

        expect(agent.state).toEqual(AgentState.Discovery);
        await agent.execute(factsheet);
        expect(agent.state).toEqual(AgentState.Finished);
        expect(factsheet.projectScope?.is_user_login_and_logout).toBeTruthy();
    });
    test('Architect a site that requires external URLs', async () => {
        const agent: ArchitectAgent = new ArchitectAgent();
        const factsheet: FactSheet = {
            projectDescription:
                'Build a website that will allow me to query and display current stock prices.',
        };

        expect(agent.state).toEqual(AgentState.Discovery);
        await agent.execute(factsheet);
        expect(agent.state).toEqual(AgentState.Finished);
        expect(factsheet.projectScope?.is_external_urls_required).toBeTruthy();
    });
    test('Architect a site that requires CRUD, authentication, and external URLs', async () => {
        const agent: ArchitectAgent = new ArchitectAgent();
        const factsheet: FactSheet = {
            projectDescription:
                'build a website that fetches and trackes fitness progress and saves timezone information',
        };

        expect(agent.state).toEqual(AgentState.Discovery);
        await agent.execute(factsheet);
        expect(agent.state).toEqual(AgentState.Finished);
        expect(factsheet.projectScope?.is_crud_required).toBeTruthy();
        expect(factsheet.projectScope?.is_user_login_and_logout).toBeTruthy();
        expect(factsheet.projectScope?.is_external_urls_required).toBeTruthy();
    });
});

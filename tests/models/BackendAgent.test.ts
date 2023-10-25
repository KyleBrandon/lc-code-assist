import { readExecMain } from '../../src/helpers/general';
import { BackendAgent } from '../../src/models/BackendAgent';
import { AgentState, FactSheet } from '../../src/models/BasicAgent';

describe('BackendAgent Tests', () => {
    const FACTSHEET: FactSheet = {
        projectDescription:
            'build a website that fetches and tracks workout information and progress with timezone information',
        projectScope: {
            is_crud_required: true,
            is_user_login_and_logout: true,
            is_external_urls_required: true,
        },
        externalURLs: ['http://worldtimeapi.org/api/timezone'],
    };

    test('BackendAgent.processDiscoveryState: build backend code', async () => {
        const agent: BackendAgent = new BackendAgent();
        const factsheet: FactSheet = FACTSHEET;

        await agent.processDiscoveryState(factsheet);
        expect(factsheet.backendCode).toBeTruthy();
        expect(agent.state).toBe(AgentState.Working);
    }, 300000);

    test('BackendAgent.processWorkingState: improve backend code', async () => {
        const agent: BackendAgent = new BackendAgent();
        const factsheet: FactSheet = FACTSHEET;
        factsheet.backendCode = readExecMain(); // read the backend code from the filesystem

        // ensure that we test improveBackendCode
        agent.bugCount = 0;
        agent.state = AgentState.Working;
        await agent.processWorkingState(factsheet);
        expect(factsheet.backendCode).toBeTruthy();
        expect(agent.state).toBe(AgentState.UnitTesting);
    }, 300000);

    test('BackendAgent.processWorkingState: fix code bugs', async () => {
        const agent: BackendAgent = new BackendAgent();
        const factsheet: FactSheet = FACTSHEET;
        factsheet.backendCode = readExecMain(); // read the backend code from the filesystem

        // ensure that we test improveBackendCode
        agent.bugCount = 1;
        agent.state = AgentState.Working;
        await agent.processWorkingState(factsheet);
        expect(factsheet.backendCode).toBeTruthy();
        expect(agent.state).toBe(AgentState.UnitTesting);
    }, 300000);

    test('BackendAgent.testCodeBuild: failure', async () => {
        const agent: BackendAgent = new BackendAgent();
        const factsheet: FactSheet = FACTSHEET;
        factsheet.backendCode = readExecMain(); // read the backend code from the filesystem

        agent.bugCount = 0;
        agent.state = AgentState.UnitTesting;
        const status: boolean = await agent.testCodeBuild();
        expect(status).toBeFalsy();
        expect(agent.state).toEqual(AgentState.Working);
    }, 300000);

    test('BackendAgent.testCodeBuild: with too many errors', async () => {
        const agent: BackendAgent = new BackendAgent();
        const factsheet: FactSheet = FACTSHEET;
        const originalCode = readExecMain();
        // Cause an error in the code
        factsheet.backendCode = originalCode.slice(3);

        // ensure that we test improveBackendCode
        agent.bugCount = 3;
        agent.state = AgentState.UnitTesting;
        try {
            await agent.testCodeBuild();
        } catch (error) {
            expect(agent.bugCount).toEqual(4);
            expect((error as Error).toString()).toContain('Too many bugs');
        }
    }, 300000);

    test('BackendAgent.execute', async () => {
        const agent: BackendAgent = new BackendAgent();
        const factsheet: FactSheet = FACTSHEET;
        agent.forceAcceptUserPrompt = true;

        try {
            await agent.execute(factsheet);
        } catch (error) {
            expect((error as Error).message).toContain('Too many bugs');
        }
    }, 300000);
});

import { ManagingAgent } from '../../src/models/ManagingAgent';

describe('ManagingAgent Tests', () => {
    test('Test ManagingAgent', async () => {
        const userRequest =
            'need a full stack app that fetches and tracks my fitness progress.  It should include timezone info from the web.';
        const agent: ManagingAgent = await ManagingAgent.new(userRequest);
        await agent.executeProject();
        expect(agent.factsheet.projectScope?.is_crud_required).toBeTruthy();
        expect(agent.factsheet.projectDescription).toContain('fitness');
        expect(agent.factsheet.projectDescription).toContain('timezone');
        expect(
            agent.factsheet.projectScope?.is_external_urls_required,
        ).toBeTruthy();

        console.log(agent.factsheet);
    });
});

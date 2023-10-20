import { BasicAgent, FactSheet } from './BasicAgent';

export class ManagingAgent extends BasicAgent {
    public factSheet: FactSheet;
    public agents: BasicAgent[];

    public constructor() {}
}

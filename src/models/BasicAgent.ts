export interface RouteObject {
    is_route_dynamic: boolean;
    method: string;
    request_body: object;
    response: object;
    route: object;
}

export interface ProjectScope {
    is_crud_required: boolean;
    is_user_login_and_logout: boolean;
    is_external_urls_required: boolean;
}

export interface FactSheet {
    projectDescription: string;
    projectScope?: ProjectScope;
    externalURLs?: string[];
    backendCode?: string;
    apiEndpointSchema?: RouteObject[];
}

export enum AgentState {
    Discovery,
    Working,
    UnitTesting,
    Finished,
}

export interface DynamicAgent {
    execute(factSheet: FactSheet): Promise<void>;
}

export abstract class BasicAgent {
    public objective: string;
    public position: string;
    public state: AgentState;
    public memory: string[];

    public constructor(objective: string, position: string) {
        this.objective = objective;
        this.position = position;
        this.state = AgentState.Discovery;
        this.memory = [];
    }
}

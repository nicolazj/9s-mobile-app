export interface ClientConfig {
  baseURL: string;
  tenantId: string;
  appKey: string;
  appSecret: string;
  basicAuthToken: string;
}

export interface User {
  emailAddress: string;
  firstName: string;
  lastName: string;
  userId: string;
  userName: string;
}
export interface Company {
  companyName: string;
  companyUuid: string;
  industryUuid: String;
}

export interface UserAuth {
  access_token: string;
  expires_in: number;
  openid: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  userId: string;
}
export interface CompanyAuth {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  companyUuid: string;
}
export interface LoginPayload {
  username: string;
  password: string;
}

export interface ClientState {
  userAuth?: UserAuth;
  companyAuth?: CompanyAuth;
}
export interface Connection {
  appKey?: string;
  createdAt?: string;
  createdBy?: string;
  id: string;
  status?: string;
}
export interface Spoke {
  displayName: string;
  services: [string];
  spokesKey: string;
  type: string;
}

export interface App {
  description: string;
  features: string[];
  industries: string[];
  key: string;
  labels: string[];
  name: string;
  openBanking: boolean;
  pricing: any;
  shortName: string;
  summary: string;
  trial: any;
}
export interface Entity {
  id: string;
  name: string;
}
export enum ACTIVITY_TYPES {
  INITIATE_CONNECTION = 'initiate-connection',
  REDIRECT_USER_AGENT = 'redirect-user-agent',
  SUBMIT_AUTHORIZATION = 'submit-authorization',
  SUBMIT_CREDENTIALS = 'submit-credentials',
  SUBMIT_ACCOUNT = 'submit-account',
  GET_AVAILABLE_ENTITIES = 'get-available-entities',
  SUBMIT_ENTITY = 'submit-entity',
  SUBMIT_ENTITIES = 'submit-entities',
  REMOVE_CONNECTION = 'remove-connection',
  INITIATE_OPEN_BANKING = 'intiate-open-banking',
  REDIRECT_USER_AGENT_OPEN_BANKING = 'redirect-user-agent-open-banking',
  SUBMIT_AUTHORIZATION_OPEN_BANKING = 'submit-authorization-open-banking',
}
export interface Step {
  href: string;
  id: string;
  method: string;
}

export interface Activity {
  id: string;
  steps: Step[];
  type: ACTIVITY_TYPES;
}

export interface Workflow {
  activities: Activity[];
  id: string;
}

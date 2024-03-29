import React from 'react';

export interface Options {
  label: string;
  value: string;
}

export interface ClientConfig {
  baseURL: string;
  tenantId: string;
  appKey: string;
  appSecret: string;
  device_id: string;
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
  industryUuid: string;
  isActive?: number;
}
export interface AuthResp {
  access_token: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
export interface UserAuthResp extends AuthResp {
  openid: string;
}

export interface SignInPayload {
  username: string;
  password: string;
}
export interface SignUpPayload {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface ClientState {
  userAuth?: UserAuthResp;
  companyAuth?: AuthResp;
}

export interface Industry {
  displayName: string;
  industryUUID: string;
  active: boolean;
}
export interface Connection {
  appKey: string;
  createdAt: string;
  createdBy: string;
  id: string;
  status: string;
}
export interface Spoke {
  displayName: string;
  services: string[];
  spokesKey: string;
  type: string;
}

export interface AppDetail {
  appKey: string;
  connection?: Connection;
  app?: App;
}

interface TableRowFormatter {
  (value: any): string;
}
export interface DataRow {
  data: string[];
  strong?: boolean;
  showWhenCollapsed?: boolean;
}
export interface DataTab {
  rows: DataRow[];
  header?: React.ReactNodeArray;
  formatters: TableRowFormatter[];
  title?: string;
}
export interface Widget {
  attributes: {
    active: boolean;
    displayName: string;
    origin: string;
    showOnDashboard: boolean;
    showOnMobile: boolean;
    status: string;
    order: number;
    categories: any;
    createdAt: number;
  };
  data: {
    dataSets: {
      rows: Array<{ [key: string]: string }>;
    }[];
    extras: Array<{ label_key: string; value_1: number; value_2: number }>;
    graphData: Array<{
      data_set_name: string;
      value: number[];
    }>;
  };
  id: string;
  key: string;
}

export interface WidgetSample {
  description: string;
  key: string;
  displayName: string;
  category: string;
  services: string[];
  extras: Array<{ label_key: string; value_1: number; value_2: number }>;
  graph_data: Array<{
    data_set_name: string;
    value: number[];
  }>;
  data_sets: any;
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
  trial: {
    tryUrl: string;
  };
  logo: string;
  squareLogo: string;
}
export interface Entity {
  id: string;
  name: string;
}
export enum ACTIVITY_TYPES {
  CLIENT_INIT = '@client_init',
  SUCCEEDED = '@succeeded',
  ERRORED = '@errored',
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

export type ChartData = {
  legend: string;
  svg: {
    color: string;
  };
  data: {
    value: number;
    label_key: string;
  }[];
}[];

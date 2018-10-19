import { Container } from 'unstated';

export interface UserAuth {
  access_token: string;
  expires_in: number;
  openid: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}
export interface CompanyAuth {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

type UserId = string;
type CompanyUuid = string;

interface State {
  userAuth: UserAuth;
  companyAuth: CompanyAuth;
  userId: UserId;
  companyUuid: CompanyUuid;
}
export class Auth extends Container<State> {}

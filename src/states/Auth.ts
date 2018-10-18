import { Container } from 'unstated';

interface ClientConfig {
  baseURL: string;
  tenantId: string;
  appKey: string;
  appSecret: string;
}

interface User {
  emailAddress: string;
  firstName: string;
  lastName: string;
  userId: string;
  userName: string;
}
interface UserAuth {
  access_token: string;
  expires_in: number;
  openid: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}
interface CompanyAuth {
  access_token: string;
}
interface LoginPayload {
  username: string;
  password: string;
}

interface ClientState {
  userAuth?: UserAuth;
  companyAuth?: CompanyAuth;
}

export default class Auth extends Container<ClientState> {
  setUserAuth(userAuth: UserAuth) {
    this.setState({ userAuth });
  }
  setCompanyAuth(companyAuth: CompanyAuth) {
    this.setState({ companyAuth });
  }
}

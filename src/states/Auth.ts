import jwt from 'jwt-decode';
import { AsyncStorage } from 'react-native';
import { AuthResp, UserAuthResp } from '../types';
import PersistContainer from './PersistContainer';
type UserId = string;
type CompanyUuid = string;

interface State {
  publicAuth: AuthResp;
  userAuth: UserAuthResp;
  companyAuth: AuthResp;
  userId: UserId;
  companyUuid: CompanyUuid;
}
export class AuthState extends PersistContainer<State> {
  get config() {
    return {
      key: 'AUTH',
      version: 1,
      storage: AsyncStorage,
    };
  }

  setUser(userAuth: UserAuthResp) {
    const { openid } = userAuth;
    const { sub: userId } = jwt(openid);
    return this.setState({ userAuth, userId });
  }
  clear() {
    this.setState({
      publicAuth: undefined,
      userAuth: undefined,
      companyAuth: undefined,
      userId: undefined,
      companyUuid: undefined,
    });
  }
  isPublicTokenValid() {
    return (
      this.state &&
      this.state.publicAuth &&
      this.state.publicAuth.expires_at > Date.now()
    );
  }
  isUserTokenValid() {
    return (
      this.state &&
      this.state.userAuth &&
      this.state.userAuth.expires_at > Date.now()
    );
  }
  isCompanyTokenValid() {
    return (
      this.state &&
      this.state.companyAuth &&
      this.state.companyAuth.expires_at > Date.now()
    );
  }
  hasUserId() {
    return this.state && this.state.userId;
  }
  hasCompany() {
    return this.state && this.state.companyUuid;
  }
}

export default new AuthState();

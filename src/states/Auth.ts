import { Container } from 'unstated';
import jwt from 'jwt-decode';
import { AsyncStorage } from 'react-native';
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
export class Auth extends Container<State> {
  setUser(userAuth: UserAuth) {
    const { openid } = userAuth;
    const { sub: userId } = jwt(openid);
    return this.setState({ userAuth, userId });
  }

  isLoggedIn() {
    return this.state && this.state.userId;
  }
  async rehydrate() {
    let serialState = await AsyncStorage.getItem('auth');
    if (serialState) {
      let incomingState = JSON.parse(serialState);
      this.setState(incomingState as State);
    }

    this.subscribe(() => {
      AsyncStorage.setItem('auth', JSON.stringify(this.state));
    });
  }
}

export default new Auth();

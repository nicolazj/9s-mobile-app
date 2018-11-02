import jwt from 'jwt-decode';
import { AsyncStorage } from 'react-native';
import { Container } from 'unstated';
import { AuthResp, UserAuthResp } from '../types';

type UserId = string;
type CompanyUuid = string;

interface State {
  userAuth: UserAuthResp;
  companyAuth: AuthResp;
  userId: UserId;
  companyUuid: CompanyUuid;
}

const KEY = 'AUTH';
export class Auth extends Container<State> {
  public setUser(userAuth: UserAuthResp) {
    const { openid } = userAuth;
    const { sub: userId } = jwt(openid);
    return this.setState({ userAuth, userId });
  }

  public isLoggedIn() {
    return this.state && this.state.userId;
  }
  public async rehydrate() {
    const serialState = await AsyncStorage.getItem(KEY);
    if (serialState) {
      const incomingState = JSON.parse(serialState);
      this.setState(incomingState as State);
    }

    this.subscribe(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(this.state));
    });
  }
}

export default new Auth();

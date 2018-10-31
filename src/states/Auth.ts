import { Container } from 'unstated';
import jwt from 'jwt-decode';
import { AsyncStorage } from 'react-native';
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
  setUser(userAuth: UserAuthResp) {
    const { openid } = userAuth;
    const { sub: userId } = jwt(openid);
    return this.setState({ userAuth, userId });
  }

  isLoggedIn() {
    return this.state && this.state.userId;
  }
  async rehydrate() {
    let serialState = await AsyncStorage.getItem(KEY);
    if (serialState) {
      let incomingState = JSON.parse(serialState);
      this.setState(incomingState as State);
    }

    this.subscribe(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(this.state));
    });
  }
}

export default new Auth();

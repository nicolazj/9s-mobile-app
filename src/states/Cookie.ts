import { AsyncStorage } from 'react-native';
import PersistContainer from './PersistContainer';

interface State {
  onboarding: boolean;
}

export class CookieState extends PersistContainer<State> {
  get config() {
    return {
      key: 'COOKIE',
      version: 1,
      storage: AsyncStorage,
    };
  }
  state: State = {
    onboarding: false,
  };
}

export default new CookieState();

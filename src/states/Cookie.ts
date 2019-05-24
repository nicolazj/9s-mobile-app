import { AsyncStorage } from 'react-native';

import PersistContainer from './PersistContainer';

interface State {
  onboarding: boolean;
  currency: string;
  companyUuid?: string;
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
    currency: 'GBP',
  };

  clear() {
    this.setState({
      companyUuid: undefined,
    });
  }
}

export default new CookieState();

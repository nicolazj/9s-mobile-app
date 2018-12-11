import auth, { AuthState } from '../states/Auth';
import { ClientConfig } from '../types';
import companyAgent from './company';
import config from './config';
import publicAgent from './public';
import tokenAgent from './token';
import userAgent from './user';

export const APIClient = (config: ClientConfig) => (auth: AuthState) => {
  return {
    get token() {
      return tokenAgent(config, auth);
    },
    get public() {
      return publicAgent(config, auth);
    },
    get user() {
      return userAgent(config, auth);
    },
    get company() {
      return companyAgent(config, auth);
    },
  };
};

export default APIClient(config)(auth);

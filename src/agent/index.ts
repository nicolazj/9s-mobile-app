import axios from 'axios';
import auth, { Auth } from '../states/Auth';
import { ClientConfig } from '../types';
import basic from './basic';
import company from './company';
import config from './config';
import user from './user';

export const APIClient = (config: ClientConfig) => (auth: Auth) => {
  const instance = axios.create({
    baseURL: config.baseURL,
  });

  return {
    get basic() {
      return basic(instance, config);
    },
    get user() {
      return user(instance, config, auth);
    },
    get company() {
      return company(instance, config, auth);
    },
  };
};

export default APIClient(config)(auth);

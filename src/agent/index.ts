import axios from 'axios';
import basic from './basic';
import user from './user';
import company from './company';
import config from './config';
import { ClientConfig } from '../types';
import auth, { Auth } from '../states/Auth';

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

import axios from 'axios';
import auth, { Auth } from '../states/Auth';
import { ClientConfig } from '../types';
import basicAgent from './basic';
import companyAgent from './company';
import config from './config';
import publicAgent from './public';
import userAgent from './user';

export const APIClient = (config: ClientConfig) => (auth: Auth) => {
  const instance = axios.create({
    baseURL: config.baseURL,
  });

  return {
    get basic() {
      return basicAgent(instance, config, auth);
    },
    get public() {
      return publicAgent(instance, config, auth);
    },
    get user() {
      return userAgent(instance, config, auth);
    },
    get company() {
      return companyAgent(instance, config, auth);
    },
  };
};

export default APIClient(config)(auth);

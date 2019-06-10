import { ClientConfig } from '../types';
import companyAgent from './company';
import config from './config';
import miscAgent from './misc';
import publicAgent from './public';
import tokenAgent from './token';
import userAgent from './user';

export const APIClient = (config: ClientConfig) => {
  return {
    get token() {
      return tokenAgent(config);
    },
    get public() {
      return publicAgent(config);
    },
    get user() {
      return userAgent(config);
    },
    get company() {
      return companyAgent(config);
    },
    get misc() {
      return miscAgent();
    },
  };
};

export default APIClient(config);

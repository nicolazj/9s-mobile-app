import axios from 'axios';

import { authStoreAPI } from '../stores/auth';
import config from './config';

export default (extra?: any) => {
  const instance = axios.create({
    baseURL: config.baseURL,
    ...extra,
  });

  instance.interceptors.request.use(
    async cfg => {
      const auth = authStoreAPI.getState();
      if (cfg.url) {
        cfg.url = cfg.url.replace(/\#\{(\w*)\}/g, (_, key:string) => {
          return key in config ? config[key] : auth[key];
        });
      }
      return cfg;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return instance;
};

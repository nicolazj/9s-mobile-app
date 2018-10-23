import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import user from './user';
import company from './company';
import config from './config';
import { Buffer } from 'buffer';
import { ClientConfig, UserAuth, CompanyAuth, LoginPayload, User, Company } from '../types';
import auth, { Auth } from '../states/Auth';

const APIClient = (config: ClientConfig) => (auth: Auth) => {
  const { tenantId, appKey, appSecret } = config;
  const basicAuthToken = Buffer.from(`${appKey}:${appSecret}`).toString('base64');
  const instance = axios.create({
    baseURL: config.baseURL,
  });

  return {
    login: async (payload: LoginPayload) => {
      const r = await instance({
        method: 'POST',
        url: `/authentication/tenants/${tenantId}/token?grant_type=password`,
        data: qs.stringify(payload),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuthToken}`,
        },
      });
      const { data } = r;
      return data as UserAuth;
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

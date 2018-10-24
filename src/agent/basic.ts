import { AxiosInstance } from 'axios';
import qs from 'qs';
import { Auth, CompanyAuth } from '../states/Auth';
import { ClientConfig, UserAuth, LoginPayload } from '../types';

export default (instance: AxiosInstance, config: ClientConfig, ) => {
  const { tenantId, basicAuthToken } = config;

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
  };
};

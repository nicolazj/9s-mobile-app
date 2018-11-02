import { AxiosInstance } from 'axios';
import qs from 'qs';
import { ClientConfig, LoginPayload, UserAuthResp } from '../types';

export default (instance: AxiosInstance, config: ClientConfig) => {
  const { tenantId, basicAuthToken } = config;

  return {
    login: async (payload: LoginPayload) => {
      const r = await instance({
        method: 'POST',
        url: `/authentication/tenants/${tenantId}/token?grant_type=password`,
        data: qs.stringify(payload),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuthToken}`,
        },
      });

      const { data } = r;
      return data as UserAuthResp;
    },

    get_public_access: async () => {
      const r = await instance({
        method: 'POST',
        url: `/authentication/tenants/${tenantId}/token?grant_type=public_access`,
        data: qs.stringify({ device_id: '8275AC55-257C-448C-8097-EC7F13DB51C1' }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuthToken}`,
        },
      });

      const { data } = r;
      return data;
    },
    reset: async (emailAddress, token) => {
      const r = await instance({
        method: 'POST',
        url: `/customer/customer/tenants/${tenantId}/users/access`,
        data: { emailAddress },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = r;
      return data;
    },
  };
};

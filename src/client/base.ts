import qs from 'qs';
import jwt from 'jwt-decode';
import axios from 'axios';
import { Buffer } from 'buffer';

export interface ClientConfig {
  baseURL: string;
  tenantId: string;
  appKey: string;
  appSecret: string;
}
interface LoginPayload {
  username: string;
  password: string;
}
export interface UserAuth {
  access_token: string;
  expires_in: number;
  openid: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export default (config: ClientConfig) => {
  const { appKey, appSecret, baseURL, tenantId } = config;
  const instance = axios.create({
    baseURL,
  });
  const basicAuthToken = Buffer.from(`${appKey}:${appSecret}`).toString('base64');

  return {
    login: async (loginPayload: LoginPayload) => {
      const r = await instance.post(
        `/authentication/tenants/${tenantId}/token?grant_type=password`,
        qs.stringify(loginPayload),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuthToken}`,
          },
        }
      );
      const { data } = r;
      const { openid } = data;
      const { sub: userId } = jwt(openid);
      return { ...data, userId } as UserAuth;
    },
    company: {},
  };
};

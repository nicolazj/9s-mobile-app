import axios from 'axios';
import jwt from 'jwt-decode';
import qs from 'qs';
import { Buffer } from 'buffer';

interface Company {
  companyName: string;
  companyUuid: string;
  industryUuid: String;
}
interface Connection {
  appKey: string;
  createdAt: string;
  createdBy: string;
  id: string;
  status: string;
}

interface ClientConfig {
  baseURL: string;
  tenantId: string;
  appKey: string;
  appSecret: string;
}

const Client = ({ baseURL, tenantId, appKey, appSecret }: ClientConfig) => {
  const instance = axios.create({
    baseURL,
  });

  const basicAuthToken = Buffer.from(`${appKey}:${appSecret}`).toString('base64');
  return {
    login: async ({ username, password }: { username: string; password: string }) => {
      const r = await instance.post(
        `/authentication/tenants/${tenantId}/token?grant_type=password`,
        qs.stringify({
          username,
          password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuthToken}`,
          },
        }
      );
      const { data } = r;
      const { openid, access_token } = data;
      const { sub: userId } = jwt(openid);

      const user = {
        me: async () => {
          const r = await instance.get(`/customer/customer/tenants/${tenantId}/users/${userId}`, {
            data: null,
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': ' application/json',
            },
          });
          return r.data;
        },
        get: async (userId: string) => {
          const r = await instance.get(`/customer/customer/tenants/${tenantId}/users/${userId}`, {
            data: null,
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': ' application/json',
            },
          });
          return r.data;
        },
      };
      return {
        data,
        user,
        service: {
          list: async () => {
            const r = await instance.get(`/catalogue/catalogue/tenants/${tenantId}/services `, {
              headers: {
                Authorization: `Bearer ${access_token}`,
                'X-API-Version': 3,
              },
            });
            const {
              _embedded: { services },
            } = r.data;
            return services;
          },
          get: async (appKey: string) => {
            const r = await instance.get(`/catalogue/catalogue/tenants/${tenantId}/services/${appKey} `, {
              headers: {
                Authorization: `Bearer ${access_token}`,
                'X-API-Version': 3,
              },
            });
            const {
              _embedded: { service },
            } = r.data;
            return service;
          },
        },
        spoke: {
          get: async (type: string) => {
            const r = await instance.get(`/catalogue/catalogue/tenants/${tenantId}/spokes/types/${type}`, {
              headers: {
                Authorization: `Bearer ${access_token}`,
                'X-API-Version': 3,
              },
            });
            const {
              _embedded: { spokes },
            } = r.data;
            return spokes;
          },
        },
      };
    },
  };
};

export default Client({
  baseURL: 'https://api.9spokes.io/dev02',
  tenantId: '00000000-0000-0005-5555-555555555555',
  appKey: 'mobileSmudgeDEV02',
  appSecret: 'zYfCuhQnBz5rvv7nR9s9JZ2AXY49uVVhYYN2BExF',
});

import log from '../logging';
import { authStoreAPI, isPublicTokenValid } from '../stores/auth';
import { Industry, SignUpPayload } from '../types';
import axios from './axios';
import config from './config';
import token from './token';

  const { tenantId } = config;

  const instance = axios();
  instance.interceptors.request.use(
    async cfg => {
      if (!isPublicTokenValid()) {
        await token.public();
      }
      cfg.headers.Authorization = `Bearer ${
        authStoreAPI.getState().publicAuth!.access_token
      }`;
      return cfg;
    },
    error => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      log(JSON.stringify(err, null, 2));
      return Promise.reject(err);
    }
  );

  export default {
    user: {
      isExisted: async (emailAddress: string) => {
        try {
          await instance.head(
            `/customer/customer/tenants/${tenantId}/users/userName/${emailAddress}`
          );
          return true;
        } catch (err) {
          if (err.response.status === 404) {
            return false;
          } else {
            throw err;
          }
        }
      },
      create: async (values: SignUpPayload) => {
        const r = await instance.post(
          `/customer/customer/tenants/${tenantId}/users`,
          {
            ...values,
            termsAndConditionsAccepted: true,
            emailAddress: values.userName,
          }
        );
        return r.data;
      },
    },
    password: {
      reset: async (emailAddress: string) => {
        const r = await instance.post(
          `/customer/customer/tenants/${tenantId}/users/access`,
          { emailAddress }
        );
        const { data } = r;
        return data;
      },
    },
    industry: {
      get: async () => {
        const r = await instance.get<{
          _embedded: {
            industries: Industry[];
          };
        }>(
          `/catalogue/catalogue/tenants/${tenantId}/industries`,

          {
            headers: {
              'X-API-Version': 3,
            },
          }
        );

        const {
          _embedded: { industries },
        } = r.data;
        return industries.filter(i => i.active);
      },
    },
  };

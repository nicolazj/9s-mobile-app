import axios from 'axios';

import log from '../logging';
import { authStoreAPI, hasUserId, isUserTokenValid } from '../stores/auth';
import { App, ClientConfig, Company, Spoke } from '../types';
import token from './token';

export default (cconfig: ClientConfig) => {
  const { baseURL, tenantId } = cconfig;

  const instance = axios.create({
    baseURL,
  });
  instance.interceptors.request.use(
    async config => {
      if (hasUserId() && !isUserTokenValid()) {
        await token(cconfig).refreshUserToken();
        log('refresh token ok ======================================');
      }
      config.headers.Authorization = `Bearer ${
        authStoreAPI.getState().userAuth!.access_token
      }`;
      return config;
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

  return {
    user: {
      me: async () => {
        const r = await instance.get(
          `/customer/customer/tenants/${tenantId}/users/${
            authStoreAPI.getState().userId
          }`,
          {
            data: null,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        return r.data;
      },
      update: async (data: Object) => {
        const r = await instance.put(
          `/customer/customer/tenants/${tenantId}/users/${
            authStoreAPI.getState().userId
          }`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return r.data;
      },
      get: async (userId: string) => {
        const r = await instance.get(
          `/customer/customer/tenants/${tenantId}/users/${userId}`,
          {}
        );

        return r.data;
      },
    },
    widget: {
      config: {
        list: async () => {
          const r = await instance.get(
            `/widget/tenants/${tenantId}/widget-configs`,
            {
              headers: {
                'X-API-Version': 3,
              },
            }
          );

          return r.data;
        },
        get: async (widgetKey: string) => {
          const r = await instance.get(
            `/widget/tenants/${tenantId}/widget-configs/${widgetKey}`,
            {
              headers: {
                'X-API-Version': 3,
              },
            }
          );
        },
      },
    },
    service: {
      list: async () => {
        const r = await instance.get(
          `/catalogue/catalogue/tenants/${tenantId}/services `,
          {
            headers: {
              'X-API-Version': 3,
            },
          }
        );
        const {
          _embedded: { services },
        } = r.data;
        return services as App[];
      },
      get: async (appKey: string) => {
        const r = await instance.get(
          `/catalogue/catalogue/tenants/${tenantId}/services/${appKey}`,
          {
            headers: {
              'X-API-Version': 3,
            },
          }
        );
        const {
          _embedded: { service },
          _links: { bigLogo, transparentLogo },
        } = r.data;
        service.logo = bigLogo.href;
        service.squareLogo = transparentLogo.href;
        return service as App;
      },
    },
    spoke: {
      get: async (type: string) => {
        const r = await instance.get(
          `/catalogue/catalogue/tenants/${tenantId}/spokes/types/${type}`,
          {
            headers: {
              'X-API-Version': 3,
            },
          }
        );
        const {
          _embedded: { spokes },
        } = r.data;
        return spokes as Spoke[];
      },
    },
    application: {
      list: async () => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/applications`,
          {}
        );
        return r;
      },
      get: async (appKey: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/applications/${appKey}/configuration`,
          {}
        );

        const {
          _embedded: { configuration },
        } = r.data;
        return configuration;
      },
    },
    company: {
      create: async (p: any) => {
        const r = await instance.post<Company>(
          `/customer/customer/tenants/${tenantId}/companies`,
          p,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        return r.data;
      },
      list: async () => {
        const userId = authStoreAPI.getState().userId;
        const r = await instance.get(
          `/customer/customer/tenants/${tenantId}/users/${userId}/companies`,
          {
            data: null, // needed for this endpoint
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const {
          _embedded: { companies },
        } = r.data;

        return companies as Company[];
      },
    },
  };
};

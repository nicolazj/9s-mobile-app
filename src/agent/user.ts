import axios, { AxiosInstance } from 'axios';
import { AuthState } from '../states/Auth';
import { App, ClientConfig, Company, Spoke } from '../types';
import agent from './index';
export default (i: AxiosInstance, config: ClientConfig, auth: AuthState) => {
  const { tenantId } = config;

  const instance = axios.create({
    baseURL: `${config.baseURL}`,
  });
  instance.interceptors.request.use(
    async config => {
      if (auth.hasUserId() && !auth.isUserTokenValid()) {
        await agent.token.refreshUserToken();
      }
      config.headers.Authorization = `Bearer ${auth.state.userAuth.access_token}`;
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
      console.log(JSON.stringify(err, null, 2));
      return Promise.reject(err);
    }
  );

  return {
    user: {
      me: async () => {
        const { userId } = auth.state;
        const r = await instance.get(`/customer/customer/tenants/${tenantId}/users/${auth.state.userId}`, {
          data: null,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        return r.data;
      },
      get: async (userId: string) => {
        const r = await instance.get(`/customer/customer/tenants/${tenantId}/users/${userId}`, {});

        return r.data;
      },
    },
    widget: {
      config: {
        list: async () => {
          const r = await instance.get(`/widget/tenants/${tenantId}/widget-configs`, {
            headers: {
              'X-API-Version': 3,
            },
          });

          return r.data;
        },
        get: async (widgetKey: string) => {
          const r = await instance.get(`/widget/tenants/${tenantId}/widget-configs/${widgetKey}`, {
            headers: {
              'X-API-Version': 3,
            },
          });
        },
      },
    },
    service: {
      list: async () => {
        const r = await instance.get(`/catalogue/catalogue/tenants/${tenantId}/services `, {
          headers: {
            'X-API-Version': 3,
          },
        });
        const {
          _embedded: { services },
        } = r.data;
        return services as App[];
      },
      get: async (appKey: string) => {
        const r = await instance.get(`/catalogue/catalogue/tenants/${tenantId}/services/${appKey}`, {
          headers: {
            'X-API-Version': 3,
          },
        });
        const {
          _embedded: { service },
          _links: { bigLogo },
        } = r.data;
        service.logo = bigLogo.href;
        return service as App;
      },
    },
    spoke: {
      get: async (type: string) => {
        const r = await instance.get(`/catalogue/catalogue/tenants/${tenantId}/spokes/types/${type}`, {
          headers: {
            'X-API-Version': 3,
          },
        });
        const {
          _embedded: { spokes },
        } = r.data;
        return spokes as Spoke[];
      },
    },
    application: {
      list: async () => {
        const r = await instance.get(`/connections/connections/tenants/${tenantId}/applications`, {});
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
      create: async p => {
        const r = await instance.post<Company>(`/customer/customer/tenants/${tenantId}/companies`, p, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        return r.data;
      },
      list: async () => {
        const { userId } = auth.state;
        const r = await instance.get(`/customer/customer/tenants/${tenantId}/users/${userId}/companies`, {
          data: null, // needed for this endpoint
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const {
          _embedded: { companies },
        } = r.data;

        return companies as Company[];
      },
    },
  };
};

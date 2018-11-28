import { AxiosInstance } from 'axios';
import { Auth } from '../states/Auth';
import { App, ClientConfig, Company, Spoke } from '../types';
export default (instance: AxiosInstance, config: ClientConfig, auth: Auth) => {
  const { tenantId } = config;
  const { access_token } = auth.state.userAuth;
  const { userId } = auth.state;

  return {
    widget: {
      config: {
        list: async () => {
          const r = await instance.get(`/widget/tenants/${tenantId}/widget-configs`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'X-API-Version': 3,
            },
          });

          return r.data;
        },
        get: async (widgetKey: string) => {
          const r = await instance.get(`/widget/tenants/${tenantId}/widget-configs/${widgetKey}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
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
            Authorization: `Bearer ${access_token}`,
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
            Authorization: `Bearer ${access_token}`,
            'X-API-Version': 3,
          },
        });
        const {
          _embedded: { service },
        } = r.data;
        return service as App;
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
        return spokes as Spoke[];
      },
    },
    application: {
      list: async () => {
        const r = await instance.get(`/connections/connections/tenants/${tenantId}/applications`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        return r;
      },
      get: async (appKey: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/applications/${appKey}/configuration`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
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
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        return r.data;
      },
      list: async () => {
        const r = await instance.get(`/customer/customer/tenants/${tenantId}/users/${userId}/companies`, {
          data: null, // needed for this endpoint
          headers: {
            Authorization: `Bearer ${access_token}`,
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

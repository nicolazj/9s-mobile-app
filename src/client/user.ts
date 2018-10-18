import qs from 'qs';
import axios from 'axios';
import { ClientConfig, UserAuth } from '../types';

interface Company {
  companyName: string;
  companyUuid: string;
  industryUuid: String;
}

export default (config: ClientConfig, userAuth: UserAuth) => {
  const { appKey, appSecret, baseURL, tenantId } = config;
  const { access_token, userId } = userAuth;
  const instance = axios.create({
    baseURL,
  });

  return {
    widget: {
      config: {
        list: async () => {
          const r = await instance.get('/widget/tenants/00000000-0000-0005-5555-555555555555/widget-configs', {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'X-API-Version': 3,
            },
          });

          return r.data;
        },
        get: async (widget_key: string) => {
          const r = await instance.get(
            `/widget/tenants/00000000-0000-0005-5555-555555555555/widget-configs/${widget_key}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                'X-API-Version': 3,
              },
            }
          );
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
        return services;
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

        return companies as [Company];
      },
    },
  };
};

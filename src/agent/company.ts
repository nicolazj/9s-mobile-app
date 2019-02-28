import axios from 'axios';
import qs from 'qs';
import { AuthState } from '../states/Auth';
import { ClientConfig, Connection, Widget, Workflow } from '../types';
import token from './token';

export default (cconfig: ClientConfig, auth: AuthState) => {
  const { baseURL, tenantId } = cconfig;
  const { userId, companyUuid } = auth.state;

  const instance = axios.create({
    baseURL,
  });
  instance.interceptors.request.use(
    async config => {
      if (auth.hasCompany() && !auth.isCompanyTokenValid()) {
        await token(cconfig, auth).refreshCompanyToken();
      }
      config.headers.Authorization = `Bearer ${auth.state.companyAuth.access_token}`;
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
    send: async (url: string, method: string, data: any) => {
      return instance({
        url: '/connections/connections' + url,
        method,
        data: qs.stringify(data, { encode: false }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
    widget: {
      list: async () => {
        try {
          const r = await instance.get(`/widget/tenants/${tenantId}/users/${userId}/companies/${companyUuid}/widgets`, {
            headers: {
              'X-API-Version': 3,
            },
          });

          const {
            _embedded: { widgets },
          } = r.data;
          return widgets.map((w: any) => w._embedded) as Widget[];
        } catch (err) {
          if (err.response.status === 404) {
            return [];
          } else throw err;
        }
      },
      addByAppKey: async (appKey: string) => {
        const r = await instance.post(
          `/widget/tenants/${tenantId}/users/${userId}/companies/${companyUuid}/widgets`,
          qs.stringify({
            appKey,
          }),
          {
            headers: {
              'X-API-Version': 3,
            },
          }
        );

        return r;
      },

      deleteByAppKey: async (appKey: string) => {
        const r = await instance.delete(
          `/widget/tenants/${tenantId}/users/${userId}/companies/${companyUuid}/widgets?appKey=${appKey}`,
          {
            headers: {
              'X-API-Version': 3,
            },
          }
        );
        return r;
      },
      updateAttrs: async (widgetId: string, data: any) => {
        const r = await instance.put(
          `widget/tenants/${tenantId}/users/${userId}/companies/${companyUuid}/widgets/${widgetId}/attributes`,
          qs.stringify(data),
          {
            headers: {
              'X-API-Version': 3,
            },
          }
        );
      },
    },
    connection: {
      forApp: async (appKey: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/applications/${appKey}/connections/active`,
          {}
        );

        const {
          _embedded: { connections },
        } = r.data;
        return connections as Connection[];
      },
      list: async () => {
        const r = await instance.get(`/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections`);

        const {
          _embedded: { connections },
        } = r.data;

        return connections as Connection[];
      },
      get: async (id: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}`
        );
        return r.data as Connection;
      },
      delete: async (id: string) => {
        const r = await instance.delete(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}`
        );
        return r.data;
      },
      create: async (appKey: string) => {
        const r = await instance.post(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections`,
          qs.stringify({
            appKey,
          })
        );
        const location = r.request.responseHeaders.Location;
        const arr = location.split('/');
        const connection = { id: arr[arr.length - 1] };

        return connection as Connection;
      },
      sendAuth: async (id: string, authRes: any) => {
        const r = await instance.post(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}/authorization`,
          qs.stringify(authRes),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        return r.data;
      },
    },
    entities: {
      list: async (id: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}/entities`
        );
        const {
          _embedded: { entities },
        } = r.data;
        return entities;
      },
      put: async (id: string, entities: any) => {
        const r = await instance.put(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}/entities`,
          entities,
          {
            headers: {
              'Content-Type': 'application/hal+json',
            },
          }
        );
        return r.data;
      },
    },
    workflow: {
      update: async (workflowId: string, activityId: string, stepId: string) => {
        const r = await instance.put(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow/${workflowId}?activityId=${activityId}&stepId=${stepId}`,
          null
        );
        return r.data.workflow;
      },
      resume: async (appKey: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow/resume?appKey=${appKey}&outcome=connect`
        );
        return r.data.workflow;
      },
      reconnect: async (appKey: string) => {
        const r = await instance.post(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow?appKey=${appKey}&outcome=reconnect`,
          null
        );
        return r.data.workflow;
      },
      create: async (appKey: string) => {
        const r = await instance.post(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow?appKey=${appKey}&outcome=connect`,
          null
        );
        return r.data.workflow as Workflow;
      },
    },
  };
};

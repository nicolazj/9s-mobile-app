import qs from 'qs';
import { AxiosInstance } from 'axios';
import { Auth } from '../states/Auth';
import { ClientConfig, Connection, Workflow } from '../types';

export default (instance: AxiosInstance, config: ClientConfig, auth: Auth) => {
  const { baseURL, tenantId } = config;
  const { userId, companyUuid, companyAuth } = auth.state;
  const { access_token } = companyAuth;

  return {
    send: async (url: string, method: string, data: any) => {
      return instance({
        baseURL: baseURL + '/connections/connections',
        url,
        method,
        data: qs.stringify(data, { encode: false }),
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
    widget: {
      list: async () => {
        const r = await instance.get(`/widget/tenants/${tenantId}/users/${userId}/companies/${companyUuid}/widgets`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'X-API-Version': 3,
          },
        });
        return r.data;
      },
      deleteByAppKey: async (appKey: string) => {
        const r = await instance.delete(
          `/widget/tenants/${tenantId}/users/${userId}/companies/${companyUuid}/widgets?appKey=${appKey}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        return r;
      },
    },
    connection: {
      forApp: async (appKey: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/applications/${appKey}/connections/active`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const {
          _embedded: { connections },
        } = r.data;
        return connections as Connection[];
      },
      list: async () => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const {
          _embedded: { connections },
        } = r.data;

        return connections as Connection[];
      },
      get: async (id: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}`,

          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return r.data as Connection;
      },
      delete: async (id: string) => {
        const r = await instance.delete(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}`,

          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return r.data;
      },
      create: async (appKey: string) => {
        const r = await instance.post(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections`,
          qs.stringify({
            appKey,
          }),
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const location = r.request.responseHeaders.Location;
        const arr = location.split('/');
        const connection = { id: arr[arr.length - 1] };

        return connection as Connection;
      },
      sendAuth: async (id: string, auth: any) => {
        const r = await instance.post(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}/authorization`,
          qs.stringify(auth),
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
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
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}/entities`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
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
              Authorization: `Bearer ${access_token}`,
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
          null,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return r.data.workflow;
      },
      resume: async (appKey: string) => {
        const r = await instance.get(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow/resume?appKey=${appKey}&outcome=connect`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return r.data.workflow;
      },
      reconnect: async (appKey: string) => {
        const r = await instance.post(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow?appKey=${appKey}&outcome=reconnect`,
          null,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return r.data.workflow;
      },
      create: async (appKey: string) => {
        const r = await instance.post(
          `/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow?appKey=${appKey}&outcome=connect`,
          null,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return r.data.workflow as Workflow;
      },
      // get: async (appKey: string) => {
      //   const r = await instance.get(`/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow`, {
      //     headers: {
      //       Authorization: `Bearer ${access_token}`,
      //     },
      //   });
      //   return r.data;
      // },
    },
  };
};

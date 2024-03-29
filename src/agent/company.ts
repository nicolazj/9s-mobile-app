import qs from 'qs';

import log from '../logging';
import { authStoreAPI, hasCompany, isCompanyTokenValid } from '../stores/auth';
import { Connection, Widget, Workflow } from '../types';
import axios from './axios';
import token from './token';

const instance = axios();
instance.interceptors.request.use(
  async cfg => {
    if (hasCompany() && !isCompanyTokenValid()) {
      await token.refreshCompanyToken();
    }
    cfg.headers.Authorization = `Bearer ${
      authStoreAPI.getState().companyAuth!.access_token
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
        const r = await instance.get(
          `/widget/tenants/#{tenantId}/users/#{userId}/companies/#{companyUuid}/widgets`,
          {
            headers: {
              'X-API-Version': 3,
            },
          }
        );

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
        `/widget/tenants/#{tenantId}/users/#{userId}/companies/#{companyUuid}/widgets`,
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
        `/widget/tenants/#{tenantId}/users/#{userId}/companies/#{companyUuid}/widgets?appKey=${appKey}`,
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
        `widget/tenants/#{tenantId}/users/#{userId}/companies/#{companyUuid}/widgets/${widgetId}/attributes`,
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
        `/connections/connections/tenants/#{tenantId}/applications/${appKey}/connections/active`,
        {}
      );

      const {
        _embedded: { connections },
      } = r.data;
      return connections as Connection[];
    },
    list: async () => {
      const r = await instance.get(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/connections`
      );

      const {
        _embedded: { connections },
      } = r.data;

      return connections as Connection[];
    },
    get: async (id: string) => {
      const r = await instance.get(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/connections/${id}`
      );
      return r.data as Connection;
    },
    delete: async (id: string) => {
      const r = await instance.delete(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/connections/${id}`
      );
      return r.data;
    },
    create: async (appKey: string) => {
      const r = await instance.post(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/connections`,
        qs.stringify({
          appKey,
        })
      );
      const { location, Location } = r.request.responseHeaders;
      const arr = (location || Location).split('/');
      const connection = { id: arr[arr.length - 1] };

      return connection as Connection;
    },
    sendAuth: async (id: string, authRes: any) => {
      const r = await instance.post(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/connections/${id}/authorization`,
        qs.stringify(authRes),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return r.data;
    },
    sendAccount: async (id: string, selectedAccount: any) => {
      const r = await instance.put(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/connections/${id}/accounts`,
        selectedAccount,
        {
          headers: {
            'Content-Type': 'application/hal+json',
          },
        }
      );
      return r.data;
    },
  },
  entities: {
    list: async (id: string) => {
      const r = await instance.get(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/connections/${id}/entities`
      );
      const {
        _embedded: { entities },
      } = r.data;
      return entities;
    },
    put: async (id: string, entities: any) => {
      const r = await instance.put(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/connections/${id}/entities`,
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
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/workflow/${workflowId}?activityId=${activityId}&stepId=${stepId}`,
        null
      );
      return r.data.workflow as Workflow;
    },
    resume: async (appKey: string) => {
      const r = await instance.get(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/workflow/resume?appKey=${appKey}&outcome=connect`
      );
      return r.data.workflow as Workflow;
    },
    reconnect: async (appKey: string) => {
      const r = await instance.post(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/workflow?appKey=${appKey}&outcome=reconnect`,
        null
      );
      return r.data.workflow as Workflow;
    },
    create: async (appKey: string) => {
      const r = await instance.post(
        `/connections/connections/tenants/#{tenantId}/company/#{companyUuid}/workflow?appKey=${appKey}&outcome=connect`,
        null
      );
      return r.data.workflow as Workflow;
    },
  },
};

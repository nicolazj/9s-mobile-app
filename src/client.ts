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
type Client = typeof client;
type UserClient = ReturnType<Client>;

const client = ({
  baseURL,
  tenantId,
  appKey,
  appSecret,
}: {
  baseURL: string;
  tenantId: string;
  appKey: string;
  appSecret: string;
}) => {
  const instance = axios.create({
    baseURL,
  });
  const basicAuthToken = Buffer.from(`${appKey}:${appSecret}`).toString('base64');
  return {
    login: async (username: string, password: string) => {
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
      return {
        data,
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
          get: async (companyUuid: string) => {
            const r = await instance.post(
              `/authentication/tenants/${tenantId}/token?grant_type=token-exchange`,
              qs.stringify({
                context: companyUuid,
                subject_token: openid,
                subject_token_type: 'openid',
              }),
              {
                headers: {
                  Authorization: `Basic ${basicAuthToken}`,
                },
              }
            );
            const { data } = r;
            const { access_token } = data;
            return {
              data,
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
                  return connections;
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

                  return connections as [Connection];
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
                  return r.data;
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
                  console.log('r ', r);

                  const location = r.request.responseHeaders.Location;
                  const arr = location.split('/');
                  const connection = { id: arr[arr.length - 1] };
                  console.log('create connection ', connection);

                  return connection;
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
                entities: async (id: string) => {
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
                put_entities: async (id: string, entities: any) => {
                  const r = await instance.post(
                    `/connections/connections/tenants/${tenantId}/company/${companyUuid}/connections/${id}/entities`,
                    entities,
                    {
                      headers: {
                        Authorization: `Bearer ${access_token}`,
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
                  return r.data.workflow;
                },
                get: async (appKey: string) => {
                  const r = await instance.get(
                    `/connections/connections/tenants/${tenantId}/company/${companyUuid}/workflow`,
                    {
                      headers: {
                        Authorization: `Bearer ${access_token}`,
                      },
                    }
                  );
                  return r.data;
                },
              },
            };
          },
        },
      };
    },
  };
};

export default client;

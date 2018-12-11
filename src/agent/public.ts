import axios from 'axios';
import { AuthState } from '../states/Auth';
import { ClientConfig } from '../types';
import token from './token';

export default (config: ClientConfig, auth: AuthState) => {
  const { tenantId } = config;

  const instance = axios.create({
    baseURL: `${config.baseURL}`,
  });
  instance.interceptors.request.use(
    async config => {
      if (!auth.isPublicTokenValid()) {
        await token.public();
      }
      config.headers.Authorization = `Bearer ${auth.state.publicAuth.access_token}`;
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
      isExisted: async (emailAddress: string) => {
        try {
          await instance.head(`/customer/customer/tenants/${tenantId}/users/userName/${emailAddress}`);
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
        const r = await instance.post(`/customer/customer/tenants/${tenantId}/users`, {
          ...values,
          termsAndConditionsAccepted: true,
          emailAddress: values.userName,
        });
        return r.data;
      },
    },
    password: {
      reset: async (emailAddress: string) => {
        const r = await instance.post(`/customer/customer/tenants/${tenantId}/users/access`, { emailAddress });
        const { data } = r;
        return data;
      },
    },
    industry: {
      get: async () => {
        const r = await instance.get(
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
        return industries;
      },
    },
  };
};

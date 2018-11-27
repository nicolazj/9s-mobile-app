import { AxiosInstance } from 'axios';
import { Auth } from '../states/Auth';
import { ClientConfig, SignUpPayload } from '../types';

export default (instance: AxiosInstance, config: ClientConfig, auth: Auth) => {
  const { tenantId } = config;
  const { publicAuth } = auth.state;
  const { access_token } = publicAuth;
  return {
    user: {
      isExisted: async (emailAddress: string) => {
        try {
          await instance.head(`/customer/customer/tenants/${tenantId}/users/userName/${emailAddress}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
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
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        return r.data;
      },
    },
    password: {
      reset: async (emailAddress: string) => {
        const r = await instance.post(
          `/customer/customer/tenants/${tenantId}/users/access`,
          { emailAddress },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const { data } = r;
        return data;
      },
    },
  };
};

import { AxiosInstance } from 'axios';
import { Auth } from '../states/Auth';
import { ClientConfig } from '../types';

export default (instance: AxiosInstance, config: ClientConfig, auth: Auth) => {
  const { tenantId } = config;
  const { publicAuth } = auth.state;
  const { access_token } = publicAuth;
  return {
    password: {
      reset: async (emailAddress: string) => {
        const r = await instance({
          method: 'POST',
          url: `/customer/customer/tenants/${tenantId}/users/access`,
          data: { emailAddress },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const { data } = r;
        return data;
      },
    },
  };
};

import { AxiosInstance } from 'axios';
import qs from 'qs';
import { Auth } from '../states/Auth';
import { AuthResp, ClientConfig, LoginPayload, UserAuthResp } from '../types';

export default (instance: AxiosInstance, config: ClientConfig, auth: Auth) => {
  const { tenantId, appKey, appSecret } = config;

  return {
    login: async (payload: LoginPayload) => {
      const r = await instance.post<UserAuthResp>(
        `/authentication/tenants/${tenantId}/token?grant_type=password`,
        qs.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: appKey,
            password: appSecret,
          },
        }
      );

      const { data } = r;
      console.log(data);
      await auth.setUser(data);
      return data;
    },

    getPublicAccess: async () => {
      const r = await instance.post<AuthResp>(
        `/authentication/tenants/${tenantId}/token?grant_type=public_access`,
        qs.stringify({ device_id: '8275AC55-257C-448C-8097-EC7F13DB51C1' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: appKey,
            password: appSecret,
          },
        }
      );

      const { data } = r;
      return data as AuthResp;
    },

    getCompanyAccess: async (companyUuid: string) => {
      const { openid } = auth.state.userAuth;
      const r = await instance.post<AuthResp>(
        `/authentication/tenants/${tenantId}/token?grant_type=token-exchange`,
        qs.stringify({
          context: companyUuid,
          subject_token: openid,
          subject_token_type: 'openid',
        }),
        {
          auth: {
            username: appKey,
            password: appSecret,
          },
        }
      );
      const { data } = r;

      await auth.setState({ companyUuid, companyAuth: data });
      return data;
    },
  };
};

import { AxiosInstance } from 'axios';
import qs from 'qs';
import { Auth } from '../states/Auth';
import { AuthResp, ClientConfig, SignInPayload, UserAuthResp } from '../types';

function setExipresAt(data: AuthResp) {
  data.expires_at = Date.now() + data.expires_in * 1000;
}

export default (instance: AxiosInstance, config: ClientConfig, auth: Auth) => {
  const { tenantId, appKey, appSecret } = config;

  return {
    refresh: async (token: string) => {
      const { data } = await instance.post<AuthResp>(
        `/authentication/tenants/${tenantId}/token?grant_type=refresh_token`,
        qs.stringify({ refresh_token: token }),
        {
          auth: {
            username: appKey,
            password: appSecret,
          },
        }
      );
      return data;
    },
    login: async (payload: SignInPayload) => {
      const { data } = await instance.post<UserAuthResp>(
        `/authentication/tenants/${tenantId}/token?grant_type=password`,
        qs.stringify(payload),
        {
          auth: {
            username: appKey,
            password: appSecret,
          },
        }
      );

      setExipresAt(data);
      await auth.setUser(data);
      return data;
    },

    public: async () => {
      const { data } = await instance.post<AuthResp>(
        `/authentication/tenants/${tenantId}/token?grant_type=public_access`,
        qs.stringify({ device_id: '8275AC55-257C-448C-8097-EC7F13DB51C1' }),
        {
          auth: {
            username: appKey,
            password: appSecret,
          },
        }
      );

      setExipresAt(data);
      await auth.setState({ publicAuth: data });
      return data;
    },

    exchange: async (companyUuid: string) => {
      const { openid } = auth.state.userAuth;
      const { data } = await instance.post<AuthResp>(
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
      setExipresAt(data);
      await auth.setState({ companyUuid, companyAuth: data });
      return data;
    },
  };
};

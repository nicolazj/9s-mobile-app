import axios from 'axios';
import qs from 'qs';
import { AuthState } from '../states/Auth';
import { AuthResp, ClientConfig, SignInPayload, UserAuthResp } from '../types';

function setExipresAt(data: AuthResp) {
  data.expires_at = Date.now() + data.expires_in * 1000;
}

export default (config: ClientConfig, auth: AuthState) => {
  const { tenantId, appKey, appSecret, device_id } = config;

  const instance = axios.create({
    baseURL: `${config.baseURL}/authentication/tenants/${tenantId}`,
    auth: {
      username: appKey,
      password: appSecret,
    },
  });
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
    refresh: async (token: string) => {
      const { data } = await instance.post<AuthResp>(
        `/token?grant_type=refresh_token`,
        qs.stringify({ refresh_token: token })
      );
      return data;
    },
    refreshUserToken: async () => {
      const { data } = await instance.post<UserAuthResp>(
        `/token?grant_type=refresh_token`,
        qs.stringify({ refresh_token: auth.state.userAuth.refresh_token })
      );
      setExipresAt(data);
      await auth.setUser(data);
      return data;
    },
    refreshCompanyToken: async () => {
      const { data } = await instance.post<AuthResp>(
        `/token?grant_type=refresh_token`,
        qs.stringify({ refresh_token: auth.state.companyAuth.refresh_token })
      );
      setExipresAt(data);
      await auth.setState({ companyAuth: data });
      return data;
    },
    login: async (payload: SignInPayload) => {
      const { data } = await instance.post<UserAuthResp>(`/token?grant_type=password`, qs.stringify(payload));

      setExipresAt(data);
      await auth.setUser(data);
      return data;
    },

    public: async () => {
      const { data } = await instance.post<AuthResp>(`/token?grant_type=public_access`, qs.stringify({ device_id }));

      setExipresAt(data);
      await auth.setState({ publicAuth: data });
      return data;
    },

    exchange: async (companyUuid: string) => {
      const { openid } = auth.state.userAuth;
      const { data } = await instance.post<AuthResp>(
        `/token?grant_type=token-exchange`,
        qs.stringify({
          context: companyUuid,
          subject_token: openid,
          subject_token_type: 'openid',
        })
      );
      setExipresAt(data);
      await auth.setState({ companyUuid, companyAuth: data });
      return data;
    },
  };
};

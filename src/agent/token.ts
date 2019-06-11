import axios from 'axios';
import qs from 'qs';

import log from '../logging';
import { authStoreAPI, setUser } from '../stores/auth';
import { AuthResp, ClientConfig, SignInPayload, UserAuthResp } from '../types';

function setExipresAt(data: AuthResp) {
  data.expires_at = Date.now() + data.expires_in * 1000;
}

export default (config: ClientConfig) => {
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
      log(JSON.stringify(err, null, 2));
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
        qs.stringify({
          refresh_token: authStoreAPI.getState().userAuth!.refresh_token,
        })
      );
      setExipresAt(data);
      setUser(data);
      return data;
    },
    refreshCompanyToken: async () => {
      const { data } = await instance.post<AuthResp>(
        `/token?grant_type=refresh_token`,
        qs.stringify({
          refresh_token: authStoreAPI.getState().companyAuth!.refresh_token,
        })
      );
      setExipresAt(data);
      await authStoreAPI.setState({ companyAuth: data });
      return data;
    },
    login: async (payload: SignInPayload) => {
      const { data } = await instance.post<UserAuthResp>(
        `/token?grant_type=password`,
        qs.stringify(payload)
      );

      setExipresAt(data);
      setUser(data);
      return data;
    },
    oauth: async (oauth_token: string) => {
      const { data } = await instance.post<UserAuthResp>(
        `/token?grant_type=oauth_token`,
        qs.stringify({
          oauth_token,
          oauth_token_party: 'google',
        })
      );

      setExipresAt(data);
      setUser(data);
      return data;
    },
    public: async () => {
      const { data } = await instance.post<AuthResp>(
        `/token?grant_type=public_access`,
        qs.stringify({ device_id })
      );

      setExipresAt(data);
      authStoreAPI.setState({ publicAuth: data });
      return data;
    },

    exchange: async (companyUuid: string) => {
      const openid = authStoreAPI.getState().userAuth!.openid;
      const { data } = await instance.post<AuthResp>(
        `/token?grant_type=token-exchange`,
        qs.stringify({
          context: companyUuid,
          subject_token: openid,
          subject_token_type: 'openid',
        })
      );
      setExipresAt(data);
      authStoreAPI.setState({ companyUuid, companyAuth: data });

      return data;
    },
  };
};

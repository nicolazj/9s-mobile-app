import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import jwt from 'jwt-decode';
import user from './user';
import company from './company';
import config from './config';
import { Buffer } from 'buffer';
import { ClientConfig, UserAuth, CompanyAuth, LoginPayload, User } from '../types';

class APIClient {
  private config: ClientConfig;
  private userAuth?: UserAuth;
  private companyAuth?: CompanyAuth;

  private instance: AxiosInstance;
  constructor(config: ClientConfig) {
    const { baseURL, appKey, appSecret } = config;
    this.instance = axios.create({
      baseURL,
      headers: {
        Authorization: `Basic ${Buffer.from(`${appKey}:${appSecret}`).toString('base64')}`,
      },
    });
    this.config = config;
  }
  login = async (payload: LoginPayload) => {
    const { tenantId } = this.config;

    const config = {
      method: 'POST',
      url: `/authentication/tenants/${tenantId}/token?grant_type=password`,
      data: qs.stringify(payload),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const r = await this.instance(config);
    const { data } = r;

    const { openid } = data;
    const { sub: userId } = jwt(openid);
    this.userAuth = { ...data, userId } as UserAuth;
    return this.userAuth;
  };

  auth = async (companyUuid: string) => {
    if (!this.userAuth) {
      throw new Error('no user auth');
    }
    const { tenantId } = this.config;
    const { openid } = this.userAuth;

    const r = await this.instance.post(
      `/authentication/tenants/${tenantId}/token?grant_type=token-exchange`,
      qs.stringify({
        context: companyUuid,
        subject_token: openid,
        subject_token_type: 'openid',
      })
    );
    const { data } = r;

    this.companyAuth = { ...data, companyUuid } as CompanyAuth;

    return data;
  };

  get user() {
    return this.userAuth ? user(this.config, this.userAuth) : null;
  }
  get company() {
    return this.companyAuth ? company(this.config, this.companyAuth) : null;
  }
}

export default new APIClient(config);

import { btoa } from '../utils';
import { ClientConfig } from '../types';
const appKey = 'mobileSmudgeDEV02';
const appSecret = 'zYfCuhQnBz5rvv7nR9s9JZ2AXY49uVVhYYN2BExF';
const basicAuthToken = btoa(`${appKey}:${appSecret}`);

const config: ClientConfig = {
  baseURL: 'https://api.9spokes.io/dev02',
  tenantId: '00000000-0000-0005-5555-555555555555',
  appKey,
  appSecret,
  basicAuthToken,
};

export default config;

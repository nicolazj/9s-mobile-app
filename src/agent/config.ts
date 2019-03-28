import { ClientConfig } from '../types';

const config: ClientConfig = {
  baseURL: 'https://dev.9spokes.io/api/v1',
  tenantId: '00000000-0000-0005-5555-555555555555',
  appKey: 'mobileSmudgeLocal',
  appSecret: 'F5EBea3qyTj6z4jPUgdxRQNnxHsE6uX',
  device_id: '8275AC55-257C-448C-8097-EC7F13DB51C1',
};
// bundle id com.9spokes.dashboard
// export const GOOGLE_CLIENT_ID = '389821969379-nqesnftd8ru7bq77ff29k1p11bvf7em9.apps.googleusercontent.com';
export const GOOGLE_CLIENT_ID = '248650621080-vp9dkt8bjb5d5bvlqhcfb4r54s4ip0r4.apps.googleusercontent.com';
export const GOOGLE_CLIENT_ID_REVERSED = GOOGLE_CLIENT_ID.split('.')
  .reverse()
  .join('.');

export default config;

import { Constants } from 'expo';
import { Platform } from 'react-native';

import { ClientConfig } from '../types';

const config: ClientConfig = {
  baseURL: 'https://dev.9spokes.io/api/v1',
  tenantId: '00000000-0000-0005-5555-555555555555',
  appKey: 'mobileSmudgeLocal',
  appSecret: 'F5EBea3qyTj6z4jPUgdxRQNnxHsE6uX',
  device_id: '8275AC55-257C-448C-8097-EC7F13DB51C1',
};

// bundle id com.9spokes.dashboard
export const GOOGLE_CLIENT_ID =
  Platform.OS === 'ios'
    ? Constants.manifest.ios.config.googleSignIn.reservedClientId
        .split('.')
        .reverse()
        .join('.')
    : JSON.parse(Constants.manifest.android.googleServicesFile).client[0]
        .oauth_client[0].client_id;
export const GOOGLE_CLIENT_ID_REVERSED = GOOGLE_CLIENT_ID.split('.')
  .reverse()
  .join('.');

export default config;

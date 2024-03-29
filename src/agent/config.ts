import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { ClientConfig } from '../types';

const config: ClientConfig = {
  baseURL:
    Platform.OS === 'web'
      ? 'https://localhost:8000'
      : 'https://dashboard.9spokes.com/api/v1',
  tenantId: '00000000-0000-0005-5555-555555555555',
  appKey: 'e1b7c74f966b4c2f8c4bc030c17dbae2',
  appSecret: 'YzyyGtD6Z591X10VacDduJbagzQXWMED',
  device_id: '9B0C6B82-6C80-4452-A600-A68E156AE88B',
};
export const GOOGLE_CLIENT_ID = Platform.select({
  ios: () =>
    Constants.manifest
      .ios!.config!.googleSignIn!.reservedClientId!.split('.')
      .reverse()
      .join('.'),
  android: () =>
    JSON.parse(Constants.manifest.android!.googleServicesFile!).client[0]
      .oauth_client[0].client_id,
  web: () => '11165695686-sr0hokb3intgj1jslhjujve7hcbn7b7c.apps.googleusercontent.com',
});

export default config;

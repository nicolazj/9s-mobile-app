import * as Google from 'expo-google-sign-in';

import { GOOGLE_CLIENT_ID } from '../../agent/config';

export const init = () => {
  Google.initAsync({
    clientId: GOOGLE_CLIENT_ID(),
  });
};

export const signIn = async () => {
  await Google.askForPlayServicesAsync();
  const result = await Google.signInAsync();
  return result;
};

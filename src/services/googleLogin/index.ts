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

  if(result.type === "success"){
    return {
        type:result.type, 
        accessToken:  result!.user!.auth!.accessToken!
    }; 
  }else return {
      type:result.type
  }
  
};

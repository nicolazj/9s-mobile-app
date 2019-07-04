import { GOOGLE_CLIENT_ID } from '../../agent/config';

const scriptId = 'googleScript';
export const init = () => {
  let script = window.document.getElementById(scriptId);
  if (!script) {
    script = window.document.createElement('script');
    script.id = scriptId;
    script.onload = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID(),
        });
      });
    };
    script.src = 'https://apis.google.com/js/platform.js';

    window.document.body.append(script);
  }
};

export const signIn = async () => {
  try {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    await GoogleAuth.signIn();
    const GoogleUser = GoogleAuth.currentUser.get();
    const auth = GoogleUser.getAuthResponse(true);
    const result = {
      type: 'success',
      accessToken: auth.access_token,
    };
    return result;
  } catch (err) {
    return {
      type: 'cancel',
    };
  }
};

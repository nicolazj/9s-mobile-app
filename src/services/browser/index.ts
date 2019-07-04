import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

export const open = async (url: string) => {
  return WebBrowser.openAuthSessionAsync(url, Constants.linkingUri);
};

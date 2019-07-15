import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

export const openAuthSessionAsync = async (url: string) => {
  return WebBrowser.openAuthSessionAsync(url, Constants.linkingUri);
};

export const openBrowserAsync = async (url: string) => {
  return WebBrowser.openBrowserAsync(url);
};

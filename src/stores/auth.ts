import jwt from 'jwt-decode';
import create from 'zustand';

import { AuthResp, UserAuthResp } from '../types';
import { logger } from './middleware';

const [useStore, api] = create(
  logger(set => ({
    publicAuth: null as AuthResp | null,
    userAuth: null as UserAuthResp | null,
    companyAuth: null as AuthResp | null,
    userId: '',
    companyUuid: '',
    actions: {
      setUser: (userAuth: UserAuthResp) => {
        const { openid } = userAuth;
        const { sub: userId } = jwt(openid);
        return set({ userAuth, userId });
      },
      clear: () => {
        set({
          publicAuth: null,
          userAuth: null,
          companyAuth: null,
          userId: '',
          companyUuid: '',
        });
      },
    },
  }))
);

export const useAuthStore = useStore;
export const authStoreAPI = api;
export const isPublicTokenValid = () => {
  const state = api.getState();
  return state && state.publicAuth && state.publicAuth.expires_at > Date.now();
};

export const isUserTokenValid = () => {
  const state = api.getState();
  return state && state.userAuth && state.userAuth.expires_at > Date.now();
};

export const isCompanyTokenValid = () => {
  const state = api.getState();
  return (
    state && state.companyAuth && state.companyAuth.expires_at > Date.now()
  );
};

export const hasUserId = () => {
  const state = api.getState();
  return state && state.userId;
};

export const hasCompany = () => {
  const state = api.getState();
  return state && state.companyUuid;
};

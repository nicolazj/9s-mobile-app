import create from 'zustand';

const [useStore,api] = create(set => ({
  onboarded: false,
  currency: 'GBP',
 
}));

export const useAppStore = useStore;
export const appStoreAPI = api
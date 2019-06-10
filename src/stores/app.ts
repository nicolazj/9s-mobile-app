import create from 'zustand';

import { logger } from './middleware';

const [useStore] = create(set => ({
  onboarded: false,
  currency: 'GBP',
  actions: {
    set,
  },
}));

export const useAppStore = useStore;

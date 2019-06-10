import create from 'zustand';

import { Company, User } from '../types';

const [useStore] = create(set => ({
  me: null as User | null,
  companies: [] as Company[],
  actions: {
    set,
  },
}));

export const useUserStore = useStore;

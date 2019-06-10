import create from 'zustand';

import { Company, User } from '../types';
import { compose, logger } from './middleware';

const [useStore] = create(logger(set => ({
  me: null as User | null,
  companies: [] as Company[],
  actions: {
    set
  },
})));

export const useUserStore = useStore;

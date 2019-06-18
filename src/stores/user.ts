import create from 'zustand';

import { Company, User } from '../types';

const [useStore,api] = create(set => ({
  me: null as User | null,
  companies: [] as Company[],
 
}));

export const useUserStore = useStore;
export const userStoreAPI = api
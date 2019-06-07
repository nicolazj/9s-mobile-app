import create from 'zustand';

const [useStore] = create(set => ({
  show: false,
  msg: '',
  actions: {
    show: (msg: string) => set(state => ({ show: true, msg })),
    dismiss: () => set(state => ({ show: false, msg: '' })),
  },
}));

export const useActivityStatusStore = useStore;

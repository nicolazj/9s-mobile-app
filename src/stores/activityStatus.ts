import create from 'zustand';

const [useStore, api] = create(set => ({
  show: false,
  msg: '',
}));

export const useActivityStatusStore = useStore;

export const show = (msg: string) => api.setState({ show: true, msg });
export const dismiss = () => api.setState({ show: false, msg: '' });

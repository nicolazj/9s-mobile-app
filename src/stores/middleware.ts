import { AsyncStorage } from 'react-native';
import { GetState, SetState, State, StoreApi } from 'zustand';

type K<T> = (set: SetState<State>, get: GetState<State>, api: StoreApi<T>) => T;

export function logger<TState extends State>(fn: K<TState>): K<TState> {
  return (set, get, api) => {
    const setState_ = api.setState;
    api.setState = (s: any) => {
      console.log('before=====================================', get());
      setState_(s);
      console.log('after =====================================', get());
    };
    return fn(set, get, api);
  };
}

export function persist<TState extends State>(key: string) {
  return function(fn: K<TState>): K<TState> {
    return (set, get, api) => {
      Promise.resolve(AsyncStorage.getItem(key)).then(s => {
        if (s) {
          let r = JSON.parse(s);
          set(r);
        }
      });

      const setState_ = api.setState;
      api.setState = (s: any) => {
        setState_(s);
        console.log('persist=====================================', get());
        AsyncStorage.setItem(key, JSON.stringify(get()));
      };
      return fn(set, get, api);
    };
  };
}

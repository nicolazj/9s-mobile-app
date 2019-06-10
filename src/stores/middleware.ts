import { GetState, SetState, State } from 'zustand';

type K<T> = (set: SetState<State>, get: GetState<State>, api: any) => T;

export function logger<TState extends State>(fn: K<TState>): K<TState> {
  return (set, get, api) =>
    fn(
      (...args) => {
        console.log(
          'applying',
          args.map(arg => JSON.stringify(arg, null, 2))
        );
        set(...args);
        console.log('new state', get());
      },
      get,
      api
    );
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

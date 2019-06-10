import { GetState, SetState, State } from 'zustand';

type K<T> = (set: SetState<State>, get: GetState<State>, api: any) => T;

export function logger<TState extends State>(fn: K<TState>): K<TState> {
  return (set, get, api) =>
    fn(
      (...args) => {
        console.log('before========================================', get());
        set(...args);
        console.log('after ========================================', get());
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


export const persist = key => fn => (set, get) => {
  let r = JSON.parse(localStorage.getItem(key));
  Promise.resolve(r).then(() => {
    console.log("123", r);
    set(r);
  });

  let set_ = (...args) => {
    set(...args);
    localStorage.setItem(key, JSON.stringify(get()));
  };
  console.log("retur");
  return fn(set_, get);
};

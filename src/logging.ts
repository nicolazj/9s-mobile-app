export default function log(...params: any[]) {
  __DEV__ && console.log(...params);
}

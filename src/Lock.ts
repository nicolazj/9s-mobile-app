export default class Lock<T> {
  resolve?: (value?: T | PromiseLike<T> | undefined) => void;
  hold() {
    return new Promise<T>(resolve => {
      this.resolve = resolve;
    });
  }
  release(payload: T) {
    if (this.resolve) {
      this.resolve(payload);
    }
  }
}

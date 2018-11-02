import { Entity } from './types';
class Lock<T> {
  private resolve?: (value?: T | PromiseLike<T> | undefined) => void;
  public hold() {
    return new Promise<T>(resolve => {
      this.resolve = resolve;
    });
  }
  public release(payload: T) {
    this.resolve && this.resolve(payload);
  }
}

export default new Lock<Entity>();

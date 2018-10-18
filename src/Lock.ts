class Lock<T> {
  private resolve?: (value?: T | PromiseLike<T> | undefined) => void;
  hold() {
    return new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
    });
  }
  release(payload: T) {
    this.resolve && this.resolve(payload);
  }
}

export default new Lock();

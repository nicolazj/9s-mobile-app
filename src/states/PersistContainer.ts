import { Container } from 'unstated';
import log from '../logging';

interface PersistConfig {
  key: string;
  version: number;
  storage: any;
}

export default abstract class PersistContainer<
  T extends object
> extends Container<T> {
  abstract get config(): PersistConfig;
  constructor() {
    super();

    const rehydrate = async () => {
      let config = this.config;
      try {
        let serialState = await config.storage.getItem(config.key);
        if (serialState !== null) {
          let incomingState = JSON.parse(serialState);
          if (incomingState._persist_version === config.version) {
            delete incomingState._persist_version;
            this.setState(incomingState as Partial<T>);
          } else log(' state version mismatch, skipping rehydration');
        }
      } catch (err) {
        log('err during rehydate', err);
      } finally {
        this.subscribe(() => {
          config.storage
            .setItem(
              config.key,
              JSON.stringify({
                ...this.state,
                _persist_version: config.version,
              })
            )
            .catch(err => {
              log(' err during store', err);
            });
        });
      }
    };
    rehydrate();
  }
}

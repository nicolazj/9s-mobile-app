import { Container } from 'unstated';
import { App, Connection, Spoke } from '../types';
interface State {
  spokes: Spoke[];
  connections: Connection[];
  apps: App[];
}
export interface AppDetail {
  appKey: string;
  connection?: Connection;
  app: App;
}
export class AppState extends Container<State> {
  state = {
    spokes: [],
    connections: [],
    apps: [],
  } as State;
  get activeConnections() {
    return this.state.connections.filter(c => c.status === 'ACTIVE');
  }
  get purchasedApps() {
    const activeConnections = this.activeConnections.map(c => c.appKey);
    return this.state.apps.filter(app => activeConnections.includes(app.key));
  }
  get availableApps() {
    const activeConnections = this.activeConnections.map(c => c.appKey);
    const supportedApps = ([] as string[]).concat(...this.state.spokes.map(s => s.services));

    return this.state.apps
      .filter(app => supportedApps.includes(app.key))
      .filter(app => !activeConnections.includes(app.key));
  }
  appDetail(appKey: string) {
    return {
      appKey,
      app: this.state.apps.find(app => app.key === appKey),
      connection: this.state.connections.find(app => app.appKey === appKey),
    } as AppDetail;
  }
}

export default new AppState();

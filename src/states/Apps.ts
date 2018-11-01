import { Container } from 'unstated';
import { Spoke, Connection, App } from '../types';
interface State {
  spokes: Spoke[];
  connections: Connection[];
  apps: App[];
}
export interface ConnectionStatus {
  appKey: string;
  connection?: Connection;
}
export class Apps extends Container<State> {
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
  connectionStatus(appKey: string) {
    return {
      appKey,
      connection: this.state.connections.find(c => c.appKey === appKey),
    } as ConnectionStatus;
  }
}

export default new Apps();

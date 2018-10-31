import { Container } from 'unstated';
import { Spoke, Connection, App } from '../types';
interface State {
  spokes: Spoke[];
  connections: Connection[];
  apps: App[];
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
      connection: this.state.connections.map(c => c.appKey).includes(appKey),
      connected: this.activeConnections.map(c => c.appKey).includes(appKey),
    };
  }
}

export default new Apps();

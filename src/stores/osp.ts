import _groupby from 'lodash.groupby';
import create from 'zustand';

import { App, AppDetail, Connection, Spoke, WidgetSample } from '../types';

const [useStore, api] = create(set => ({
  spokes: [] as Spoke[],
  connections: [] as Connection[],
  apps: [] as App[],
  samples: [] as WidgetSample[],
}));

export const OSPStoreAPI = api;

export const useActiveConnections = () => {
  const connections = useStore(store => store.connections);
  return connections.filter(c => c.status === 'ACTIVE');
};

export const useConnectedAppKeys = () => {
  const activeConnections = useActiveConnections();
  return activeConnections.map(c => c.appKey);
};

export const usePurchasedApps = () => {
  const apps = useStore(store => store.apps);
  const connectedAppKeys = useConnectedAppKeys();
  return apps.filter(app => connectedAppKeys.includes(app.key));
};
export const useSupportedApps = () => {
  const spokes = useStore(store => store.spokes);
  return ([] as string[]).concat(...spokes.map(s => s.services));
};

export const useAvailableApps = () => {
  const apps = useStore(store => store.apps);
  const supportedApps = useSupportedApps();
  const connectedAppKeys = useConnectedAppKeys();
  return apps
    .filter(app => supportedApps.includes(app.key))
    .filter(app => !connectedAppKeys.includes(app.key));
};
export const useApp = (appKey: string) => {
  const { apps } = useStore(({ apps }) => ({ apps }));
  return apps.find(app => app.key === appKey);
};
export const getApp = (appKey: string) => {
  return api.getState().apps.find(app => app.key === appKey);
};
export const getSample = (widgetKey: string) => {
  return api.getState().samples.find(sample => sample.key === widgetKey);
};

export const getSamplesByAppKey = (appKey: string) => {
  return api
    .getState()
    .samples.filter(sample => sample.services.includes(appKey));
};

export const getGroupedSample = () => {
  const samples = useStore(store => store.samples);
  return _groupby(samples, s => s.category);
};

export const getAppDetail = (appKey: string): AppDetail => {
  const { apps, connections } = useStore(({ apps, connections }) => ({
    apps,
    connections,
  }));
  return {
    appKey,
    app: apps.find(app => app.key === appKey),
    connection: connections.find(app => app.appKey === appKey),
  };
};

import _groupby from 'lodash.groupby';
import create from 'zustand';

import { App, AppDetail, Connection, Spoke, WidgetSample } from '../types';

const [useStore, { setState }] = create(set => ({
  spokes: [] as Spoke[],
  connections: [] as Connection[],
  apps: [] as App[],
  samples: [] as WidgetSample[],
}));

export const useOSPStore = () => {
  const { spokes, connections, apps, samples } = useStore();

  const activeConnections = connections.filter(c => c.status === 'ACTIVE');

  const connectedAppKeys = activeConnections.map(c => c.appKey);

  const purchasedApps = apps.filter(app => connectedAppKeys.includes(app.key));

  const supportedApps = ([] as string[]).concat(...spokes.map(s => s.services));

  const availableApps = apps
    .filter(app => supportedApps.includes(app.key))
    .filter(app => !connectedAppKeys.includes(app.key));

  const getApp = (appKey: string) => {
    return apps.find(app => app.key === appKey);
  };
  const getSample = (widgetKey: string) => {
    return samples.find(sample => sample.key === widgetKey);
  };

  const getSamplesByAppKey = (appKey: string) => {
    return samples.filter(sample => sample.services.includes(appKey));
  };

  const getGroupedSample = () => {
    return _groupby(samples, s => s.category);
  };

  const getAppDetail = (appKey: string): AppDetail => {
    return {
      appKey,
      app: apps.find(app => app.key === appKey),
      connection: connections.find(app => app.appKey === appKey),
    };
  };
  return {
    activeConnections,
    purchasedApps,
    availableApps,
    getApp,
    getSample,
    getSamplesByAppKey,
    getGroupedSample,
    getAppDetail,
    setOSPStore: setState,
  };
};

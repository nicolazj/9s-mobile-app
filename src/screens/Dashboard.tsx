import React from 'react';
import { RefreshControl, ScrollView as SV, StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import agent from '../agent';
import WidgetComp from '../components/widget';
import * as P from '../primitives';
import styled, { th } from '../styled';
import { Widget } from '../types';

const ScrollView = styled(SV)<{ children: React.ReactNode }>`
  background-color: ${th('color.view.bg')};
`;
const Dashboard = () => {
  const [widgets, setWidgets] = React.useState<Widget[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    reloadWidgets();
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const reloadWidgets = async () => {
    const widgets = await agent.company.widget.list();
    isMounted.current &&
      setWidgets(
        widgets
          .filter(a => a.attributes.active && a.attributes.showOnMobile)
          .sort((a, b) => {
            return a.attributes.order - b.attributes.order;
          })
      );
  };

  const _onRefresh = async () => {
    setRefreshing(true);
    await reloadWidgets();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
      }
    >
      <P.Container hasPadding>
        <NavigationEvents
          onWillFocus={() => {
            reloadWidgets();
          }}
        />
        <StatusBar barStyle="light-content" />
        {widgets.map(w => (
          <WidgetComp key={w.id} widget={w} sample={false} />
        ))}
      </P.Container>
    </ScrollView>
  );
};
export default Dashboard;

import React from 'react';
import { RefreshControl, ScrollView as SV, StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import agent from '../agent';
import WidgetComp from '../components/widget';
import * as P from '../primitives';
import styled, { th } from '../styled';
import { Widget } from '../types';

interface State {
  widgets: Widget[];
  refreshing: boolean;
}

const ScrollView = styled(SV)`
  background-color: ${th('color.view.bg')};
`;
export default class Dashboard extends React.Component<any, State> {
  state = {
    widgets: [],
    refreshing: false,
  } as State;

  reloadWidgets = async () => {
    const widgets = await agent.company.widget.list();
    this.setState({ widgets });
  };
  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.reloadWidgets();
    this.setState({ refreshing: false });
  };
  render() {
    const { widgets } = this.state;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <P.Container hasPadding>
          <NavigationEvents
            onWillFocus={() => {
              this.reloadWidgets();
            }}
          />
          <StatusBar barStyle="light-content" />
          {widgets
            .filter(a => a.attributes.active && a.attributes.showOnMobile)
            .sort((a, b) => {
              return a.attributes.order - b.attributes.order;
            })
            .map(w => (
              <WidgetComp key={w.id} widget={w} />
            ))}
        </P.Container>
      </ScrollView>
    );
  }
}

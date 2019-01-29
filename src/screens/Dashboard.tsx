import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import agent from '../agent';
import WidgetComp from '../components/widget';
import * as P from '../primitives';
import { Widget } from '../types';

interface State {
  widgets: Widget[];
}
export default class Dashboard extends React.Component<any, State> {
  state = {
    widgets: [],
  } as State;

  reloadWidgets = async () => {
    const widgets = await agent.company.widget.list();

    console.log(
      widgets
        // .filter(a => a.attributes.active && a.attributes.showOnMobile)
        .sort((a, b) => {
          return a.attributes.order - b.attributes.order;
        })
        .map(
          w =>
            w.key +
            '|| active:' +
            w.attributes.active +
            '|| som:' +
            w.attributes.showOnMobile +
            '|| order:' +
            w.attributes.order +
            '|| name:' +
            w.attributes.displayName
        )
    );
    this.setState({ widgets });
  };
  render() {
    const { widgets } = this.state;

    return (
      <ScrollView>
        <NavigationEvents
          onWillFocus={() => {
            this.reloadWidgets();
          }}
        />
        <P.Container padding>
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

import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
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
  async componentDidMount() {
    const widgets = await agent.company.widget.list();
    this.setState({ widgets });
  }
  render() {
    const { widgets } = this.state;
    console.log(widgets);
    return (
      <ScrollView>
        <P.Container padding>
          <StatusBar barStyle="light-content" />
          {widgets.map(w => (
            <WidgetComp key={w.id} widget={w} />
          ))}
        </P.Container>
      </ScrollView>
    );
  }
}

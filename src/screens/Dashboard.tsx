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
  public state = {
    widgets: [],
  } as State;
  public async componentDidMount() {
    const widgets = await agent.company.widget.list();
    this.setState({ widgets });
  }
  public render() {
    const { widgets } = this.state;
    return (
      <ScrollView>
        <P.Container padding>
          <StatusBar barStyle="light-content" />
          {this.state.widgets.map(w => (
            <WidgetComp key={w.id} widget={w} />
          ))}

          {/* {widgets.length > 0 && <WidgetComp widget={this.state.widgets[0]} />} */}
        </P.Container>
      </ScrollView>
    );
  }
}

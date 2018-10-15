import React from 'react';
import { Icon } from 'expo';

interface Props {
  focused: boolean;
  name: string;
}
export default class TabBarIcon extends React.Component<Props> {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? 'red' : 'yellow'}
      />
    );
  }
}

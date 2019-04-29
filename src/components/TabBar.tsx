import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { Text } from '../primitives';
import styled, { IThemeInterface, scale, th, withTheme } from '../styled';

interface IconProps {
  focused: boolean;
  name: string;
  theme: IThemeInterface;
}
class TabBarIcon extends React.Component<IconProps> {
  render() {
    return (
      <Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? th('color.main')(this.props) : th('color.grey')(this.props)}
      />
    );
  }
}

export const Icon = withTheme(TabBarIcon);

interface LabelProps {
  focused: boolean;
}

export const Label = styled(Text)<LabelProps>`
  font-size: ${scale(10)}px;
  color: ${props => (props.focused ? th('color.main')(props) : th('color.grey')(props))};
  text-align: center;
`;

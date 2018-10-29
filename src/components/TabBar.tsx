import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import styled, { withTheme, th, IThemeInterface } from '../styled';

import { scale } from '../ratio';
import { Text } from '../primitives';
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

export const Label = styled(Text)`
  font-size: ${scale(10)}px;
  color: ${(props: LabelProps) => (props.focused ? th('color.main')(props) : th('color.grey')(props))};
`;

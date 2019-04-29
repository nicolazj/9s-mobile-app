import React from 'react';
import { TouchableOpacityProps, View } from 'react-native';

import * as P from '../primitives';
import styled, { scale, th } from '../styled';

interface SProps {
  danger?: boolean;
  invert?: boolean;
}
const ButtonTouchable = styled(P.Touchable)<SProps>`
  background-color: ${props => (props.danger || props.invert ? '#fff' : th('color.main'))};
  border: 1px solid ${props => (props.danger ? th('color.danger') : th('color.main'))};
  width: 100%;
  border-radius: 5px;
  height: ${scale(48)}px;
  padding: ${scale(15)}px;
  margin: 5px 0;
`;

const ButtonText = styled(P.Text)<SProps>`
  text-align: center;
  color: ${props => (props.danger ? th('color.danger') : props.invert ? th('color.main') : '#fff')};
`;
interface Props extends SProps {
  title: string;
}
const Button: React.FC<Props & TouchableOpacityProps> = ({ title, danger, invert, ...props }) => (
  <ButtonTouchable danger={danger} invert={invert} {...props}>
    <View>
      <ButtonText danger={danger} invert={invert}>
        {title}
      </ButtonText>
    </View>
  </ButtonTouchable>
);
export default Button;

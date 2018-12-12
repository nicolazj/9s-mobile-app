import React from 'react';
import { TouchableNativeFeedbackProps, TouchableOpacityProps, View } from 'react-native';
import * as P from '../primitives';
import { scale } from '../scale';
import styled, { th } from '../styled';

interface SProps {
  danger?: boolean;
}
const ButtonTouchable = styled(P.Touchable)<SProps>`
  background-color: ${props => (props.danger ? '#fff' : th('color.main'))};
  border: 1px solid ${props => (props.danger ? th('color.danger') : th('color.main'))};
  width: 100%;
  border-radius: 5px;
  height: ${scale(48)}px;
  padding: ${scale(15)}px;
  margin: 5px 0;
`;

const ButtonText = styled(P.Text)<SProps>`
  text-align: center;
  color: ${props => (props.danger ? th('color.danger') : '#fff')};
`;
interface Props extends SProps {
  title: string;
}
// FIXME type is incorrect
const Button: React.SFC<Props & TouchableNativeFeedbackProps & TouchableOpacityProps> = ({
  title,
  danger,
  ...props
}) => (
  <ButtonTouchable danger={danger} {...props}>
    <View>
      <ButtonText danger={danger}>{title}</ButtonText>
    </View>
  </ButtonTouchable>
);
export default Button;

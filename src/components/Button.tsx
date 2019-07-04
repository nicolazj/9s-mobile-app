import React from 'react';
import { TouchableOpacityProps, View } from 'react-native';

import * as P from '../primitives';
import styled, { scale, th } from '../styled';

interface SProps {
  danger?: boolean;
  inverted?: boolean;
}
const ButtonTouchable = styled(P.Touchable)<SProps>`
  background-color: ${props =>
    props.danger || props.inverted ? '#fff' : th('color.main')};
  border: 1px solid
    ${props => (props.danger ? th('color.danger') : th('color.main'))};
  width: 100%;
  border-radius: 5px;
  height: ${scale(48)}px;
  padding: ${scale(15)}px;
  margin: 5px 0;
`;

// can not pass danger/ inverrted props to P.Text, as react-native-web will complain
const FilteredText = ({ danger, inverted, ...props }) => {
  return <P.Text {...props} />;
};

const ButtonText = styled(FilteredText)<SProps>`
  text-align: center;
  color: ${props =>
    props.danger ? th('color.danger') : props.inverted ? th('color.main') : '#fff'};
`;

interface Props extends SProps {
  title: string;
}
const Button: React.FC<Props & TouchableOpacityProps> = ({
  title,
  danger,
  inverted,
  ...props
}) => (
  <ButtonTouchable danger={danger} inverted={inverted} {...props}>
    <View>
      <ButtonText danger={danger} inverted={inverted}>
        {title}
      </ButtonText>
    </View>
  </ButtonTouchable>
);
export default Button;

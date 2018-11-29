import React from 'react';
import { View } from 'react-native';
import * as P from '../primitives';
import { scale } from '../scale';
import styled, { th } from '../styled';

const ButtonTouchable = styled(P.Touchable)`
  background-color: ${th('color.main')};
  width: 100%;
  border-radius: 5px;
  height: ${scale(48)}px;
  padding: ${scale(15)}px;
  margin: 5px 0;
`;

const ButtonText = styled(P.Text)`
  text-align: center;
  color: #fff;
`;

export default ({ title, ...props }) => (
  <ButtonTouchable {...props}>
    <View>
      <ButtonText>{title}</ButtonText>
    </View>
  </ButtonTouchable>
);

import React from 'react';
import { View } from 'react-native';
import * as P from '../primitives';
import styled, { th } from '../styled';

const LinkText = styled(P.Text)`
  color: ${th('color.main')};
`;
export default ({ title, ...props }) => (
  <P.Touchable {...props}>
    <View>
      <LinkText>{title}</LinkText>
    </View>
  </P.Touchable>
);

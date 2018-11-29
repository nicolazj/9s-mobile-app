import React from 'react';
import { View } from 'react-native';
import * as P from '../primitives';
import styled from '../styled';

const DelimiterWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const DelimiterText = styled(P.Text)`
  padding: 20px 30px;
`;
const DelimiterBar = styled(View)`
  height: 0;
  border: 1px solid #ccc;
  border-radius: 1;
  flex: 1;
`;

export default () => (
  <DelimiterWrapper>
    <DelimiterBar />
    <DelimiterText>or</DelimiterText>
    <DelimiterBar />
  </DelimiterWrapper>
);

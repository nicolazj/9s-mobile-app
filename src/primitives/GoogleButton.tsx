import React from 'react';
import { View, Image } from 'react-native';
import { Text } from './index';
import styled, { th } from '../styled';
import Button_ from './button';
import { scale } from '../ratio';

const GoogleButtonWrapper = styled(Button_)`
  border: 1px solid ${th('color.grey')};
  border-radius: 5px;
  height: ${scale(48)}px;
`;
const ViewParent = styled(View)`
  flex-direction: row;
  height: 100%;
`;
const ViewLeft = styled(View)`
  align-items: center;
  justify-content: center;
  width: ${scale(48)}px;
  border-right-width: 1px;
  border-right-color: ${th('color.grey')};
`;
const ViewRight = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
export default (props: any) => (
  <GoogleButtonWrapper {...props}>
    <ViewParent>
      <ViewLeft>
        <Image
          source={require('../../assets/google.png')}
          style={{
            height: scale(30),
            width: scale(30),
            resizeMode: 'contain',
          }}
        />
      </ViewLeft>
      <ViewRight>
        <Text>Log in with Google</Text>
      </ViewRight>
    </ViewParent>
  </GoogleButtonWrapper>
);

import React from 'react';
import { View, Image } from 'react-native';
import { Text } from './index';
import styled from '../styled';
import Button_ from './button';
import { r } from '../ratio';
import google from '../../assets/google.png';
const GoogleButtonWrapper = styled(Button_)`
  border: 1px solid #333;
  border-radius: 5px;
  height: ${r(48)}px;
`;
const ViewParent = styled(View)`
  flex-direction: row;
  height: 100%;
`;
const ViewLeft = styled(View)`
  border-right-color：#333;
  border-right-width:1px;
  align-items: center;
  justify-content: center;
  width:${r(48)}px;
`;
const ViewRight = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
export default props => (
  <GoogleButtonWrapper {...props}>
    <ViewParent>
      <ViewLeft>
        <Image
          source={google}
          style={{
            height: r(30),
            width: r(30),
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

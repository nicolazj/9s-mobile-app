import React from 'react';
import { Image, View } from 'react-native';

import * as P from '../primitives';
import styled, { scale, th } from '../styled';

const SocialButtonWrapper = styled(P.Touchable)`
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
export const SocialButon = ({ title, icon, ...props }) => (
  <SocialButtonWrapper {...props}>
    <ViewParent>
      <ViewLeft>
        <Image
          source={icon}
          style={{
            height: scale(30),
            width: scale(30),
            resizeMode: 'contain',
          }}
        />
      </ViewLeft>
      <ViewRight>
        <P.Text>{title}</P.Text>
      </ViewRight>
    </ViewParent>
  </SocialButtonWrapper>
);

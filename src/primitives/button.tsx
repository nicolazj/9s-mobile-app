import React from 'react';
import { View, Image } from 'react-native';
import { Text } from './index';
import { Touchable } from './index';
import styled, { th } from '../styled';
import { scale } from '../scale';

/***
 *  Button
 */
const ButtonTouchable = styled(Touchable)`
  background-color: ${th('color.main')};
  width: 100%;
  border-radius: 5px;
  height: ${scale(48)}px;
  padding: ${scale(15)}px;
`;

const ButtonText = styled(Text)`
  text-align: center;
  color: #fff;
`;

export const Button = ({ title, ...props }) => (
  <ButtonTouchable {...props}>
    <View>
      <ButtonText>{title}</ButtonText>
    </View>
  </ButtonTouchable>
);

/***
 *  Link
 */
const LinkText = styled(Text)`
  color: ${th('color.main')};
`;
export const Link = ({ title, ...props }) => (
  <Touchable {...props}>
    <View>
      <LinkText>{title}</LinkText>
    </View>
  </Touchable>
);

/***
 *  SocialLoginButton
 */
const SocialLoginButtonWrapper = styled(Touchable)`
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
export const SocialLoginButon = ({ title, icon, ...props }) => (
  <SocialLoginButtonWrapper {...props}>
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
        <Text>{title}</Text>
      </ViewRight>
    </ViewParent>
  </SocialLoginButtonWrapper>
);

export const GoogleButton = (props: any) => <SocialLoginButon title="Log in with Google" icon={require('../../assets/google.png')} {...props} />;

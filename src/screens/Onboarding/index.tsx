import React from 'react';
import { Image, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import Button from '../../components/Button';
import Link from '../../components/Link';
import Walkthrough from '../../components/Walkthrough';
import * as P from '../../primitives';
import { SCREENS } from '../../routes/constants';
import styled from '../../styled';

const Slide = styled(P.Container)`
  background: #fff;
`;
const Title = styled(P.H1)`
  text-align: center;
`;
const Subtitle = styled(P.H3)`
  color: #999;
  text-align: center;
`;
const Pic = styled(Image).attrs({ resizeMode: 'contain' })`
  width: 100%;
  height: 350px;
`;

const Walkthrough1 = () => {
  return (
    <Slide padding hcenter>
      <Title>Stay on top of your business 24/7</Title>
      <Subtitle>see the performance data that matters most to you during your bussiness day</Subtitle>

      <Pic source={require('../../../assets/onboarding1.jpeg')} />
    </Slide>
  );
};

const Walkthrough2 = () => {
  return (
    <Slide padding hcenter>
      <Title>It's simple to get started</Title>
      <Subtitle>Create your account, register your compnay, connect your favorite business apps</Subtitle>

      <Pic source={require('../../../assets/onboarding2.jpeg')} />
    </Slide>
  );
};

const Walkthrough3 = () => {
  return (
    <Slide padding hcenter>
      <Title>Make smarter decisions with data</Title>
      <Subtitle>Connect more, know more.</Subtitle>

      <Pic source={require('../../../assets/onboarding3.jpeg')} />
    </Slide>
  );
};

const Walkthrough4 = withNavigation(({ navigation }) => {
  return (
    <Slide padding hcenter>
      <Title>Access best-in-breed apps & keep growing</Title>
      <Subtitle>More apps means more insignts.</Subtitle>
      <Pic source={require('../../../assets/onboarding4.jpeg')} />
      <Button
        title="Sign up"
        onPress={() => {
          navigation.navigate(SCREENS[SCREENS.SIGN_UP]);
        }}
      />
      <View style={{ flexDirection: 'row', marginVertical: 15 }}>
        <P.Text>Already a member? </P.Text>
        <Link
          title="Log in"
          onPress={() => {
            navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
          }}
        />
      </View>
    </Slide>
  );
});

const WalkthroughView = styled(P.Container)`
  flex: 1;
  padding: 30px 0;
  background: #fff;
`;
export default class WalkthroughScreen extends React.Component {
  render = () => (
    <WalkthroughView>
      <P.SafeArea>
        <Walkthrough>
          <Walkthrough1 />
          <Walkthrough2 />
          <Walkthrough3 />
          <Walkthrough4 />
        </Walkthrough>
      </P.SafeArea>
    </WalkthroughView>
  );
}

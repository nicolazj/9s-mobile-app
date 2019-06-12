import { Video } from 'expo-av';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import Button from '../components/Button';
import Walkthrough from '../components/Walkthrough';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import styled from '../styled';

const BottomView = styled(View)`
  position: absolute;
  bottom: 0;
  flex-direction: row;
  width: 100%;
`;
const WalkthroughView = styled(P.Container)`
  flex: 1;
  background-color: yellow;
`;
const assetsMap = [
  require('../../assets/ob1.mp4'),
  require('../../assets/ob2.mp4'),
  require('../../assets/ob3.mp4'),
];

const WalkthroughSlide = ({ index = 0, current = false }) => {
  const { height, width } = Dimensions.get('window');
  const video = React.useRef<Video>(null);
  React.useEffect(() => {
    if (current && video.current) {
      video.current.playAsync();
    }
  }, [current]);
  return (
    <Video
      ref={video}
      source={assetsMap[index]}
      rate={1.0}
      isMuted={true}
      shouldPlay={false}
      resizeMode="contain"
      style={{
        width,
        height,
      }}
    />
  );
};

const WalkthroughScreen: React.FC<{
  navigation: NavigationScreenProp<any, any>;
}> = ({ navigation }) => {
  const length = 3;
  return (
    <WalkthroughView>
      <Walkthrough>
        {new Array(length).fill(0).map((_, i) => (
          <WalkthroughSlide index={i} key={i} />
        ))}
      </Walkthrough>

      <BottomView>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ flex: 1, margin: 20 }}>
            <Button
              title="Log in"
              onPress={() => {
                navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
              }}
            />
          </View>
          <View style={{ flex: 1, margin: 20 }}>
            <Button
              invert
              title="Sign up"
              onPress={() => {
                navigation.navigate(SCREENS[SCREENS.SIGN_UP]);
              }}
            />
          </View>
        </View>
      </BottomView>
    </WalkthroughView>
  );
};

export default withNavigation(WalkthroughScreen);

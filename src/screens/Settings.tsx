import { Linking } from 'expo';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';

import Button from '../components/Button';
import Link from '../components/Link';
import Switch from '../components/Switch';
import { currencyMaps } from '../currency';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { appStoreAPI, useAppStore } from '../stores/app';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';
import styled, { scale, th } from '../styled';

const Title = styled(P.H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;
const BodyText = styled(P.Text)`
  color: ${th('color.grey')};
`;

const SwitchCompanyBtn = styled(Link)`
  position: absolute;
  right: ${scale(24)}px;
  top: ${scale(24)}px;
  padding: 5px;
`;

interface Props {
  navigation: NavigationScreenProp<any, any>;
}
const Settings: React.FC<Props> = ({ navigation }) => {
  const { me, companies } = useUserStore(({ me, companies }) => ({
    me,
    companies,
  }));

  const companyUuid = useAuthStore(store => store.companyUuid);

  const { currency } = useAppStore(({ currency }) => ({
    currency,
  }));
  const reportProblem = () => {
    const company = companies.find(c => c.companyUuid === companyUuid);

    const texts = [
      'Hey 9Spokes team!',
      '',
      "Something's not right in the app and it would be great if you could have a look at it",
      '',
      'Here are my details:',
      'Name:',
      `${me!.firstName} ${me!.lastName}`,
      '',
      'Company name:',
      company ? company.companyName : '',
      '',
      '9Spokes username:',
      me!.emailAddress,
      '',
      'Device info:',
      JSON.stringify(Constants.platform, null, 2),
      '',
      'Tell us about the issue',
      'Thanks',
    ];

    Linking.openURL(
      'mailto:support@9spokes.com?subject=Mobile Query&body=' + texts.join('\n')
    );
  };
  const handleLogout = () => {
    navigation.navigate(SCREENS[SCREENS.LOGOUT]);
  };
  const company = companies
    ? companies.find(c => c.companyUuid === companyUuid)
    : null;
  return (
    <P.Container>
      <ScrollView>
        <View>
          <Title>Account</Title>
          {companies.length > 1 && (
            <SwitchCompanyBtn
              title="Change Company"
              onPress={() => {
                navigation.push(SCREENS[SCREENS.SWITCH_COMPANY]);
              }}
            />
          )}
          <P.List style={{ backgroundColor: '#fff' }}>
            <P.ListItem
              onPress={() => {
                navigation.push(SCREENS[SCREENS.UPDATE_PROFILE]);
              }}
            >
              <P.Left>
                <P.Text>User profile</P.Text>
              </P.Left>
              <P.Body>
                <BodyText>{`${me!.firstName} ${me!.lastName}`}</BodyText>
              </P.Body>
              <P.Right>
                <Ionicons name="ios-arrow-forward" />
              </P.Right>
            </P.ListItem>
            <P.ListItem
              onPress={() => {
                navigation.push(SCREENS[SCREENS.UPDATE_COMPANY]);
              }}
            >
              <P.Left>
                <P.Text>Company profile</P.Text>
              </P.Left>
              <P.Body>
                <BodyText>{company && company.companyName}</BodyText>
              </P.Body>
              <P.Right>
                <Ionicons name="ios-arrow-forward" />
              </P.Right>
            </P.ListItem>
            <P.ListItem>
              <P.Left>
                <P.Text>Currency </P.Text>
              </P.Left>
              <P.Body>
                <Switch
                  cur={currencyMaps.findIndex(c => c.currency === currency)}
                  options={currencyMaps.map((c, i) => ({
                    label: c.currency,
                    value: i,
                  }))}
                  onChange={(index: number) =>
                    appStoreAPI.setState({
                      currency: currencyMaps[index].currency,
                    })
                  }
                />
              </P.Body>
            </P.ListItem>
          </P.List>
        </View>
        <View>
          <Title>Support</Title>
          <P.List style={{ backgroundColor: '#fff' }}>
            <P.ListItem onPress={reportProblem}>
              <P.Left>
                <P.Text>Report a problem</P.Text>
              </P.Left>
              <P.Body />
              <P.Right>
                <Ionicons name="ios-arrow-forward" />
              </P.Right>
            </P.ListItem>
            <P.ListItem
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  'https://support.9spokes.com/hc/en-us'
                )
              }
            >
              <P.Left>
                <P.Text>Help center</P.Text>
              </P.Left>
              <P.Body />
              <P.Right>
                <Ionicons name="ios-arrow-forward" />
              </P.Right>
            </P.ListItem>
          </P.List>
        </View>
        <View>
          <Title>Legal</Title>

          <P.List style={{ backgroundColor: '#fff' }}>
            <P.ListItem
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  'https://www.9spokes.com/legal/terms-and-conditions/'
                )
              }
            >
              <P.Left>
                <P.Text>Terms and conditions</P.Text>
              </P.Left>
              <P.Body />
              <P.Right>
                <Ionicons name="ios-arrow-forward" />
              </P.Right>
            </P.ListItem>
            <P.ListItem
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  'https://www.9spokes.com/legal/privacy-notice/'
                )
              }
            >
              <P.Left>
                <P.Text>Privacy policy</P.Text>
              </P.Left>
              <P.Body />
              <P.Right>
                <Ionicons name="ios-arrow-forward" />
              </P.Right>
            </P.ListItem>
          </P.List>
        </View>
        <View>
          <Title>About</Title>
          <P.List style={{ backgroundColor: '#fff' }}>
            <P.ListItem>
              <P.Left>
                <P.Text>App version</P.Text>
              </P.Left>
              <P.Body />
              <P.Right>
                <P.Text>1.0.0</P.Text>
              </P.Right>
            </P.ListItem>
          </P.List>
          <Title />
          <P.Container hasMargin>
            <Button title="Log out" onPress={handleLogout} />
          </P.Container>
        </View>
      </ScrollView>
    </P.Container>
  );
};
export default Settings;

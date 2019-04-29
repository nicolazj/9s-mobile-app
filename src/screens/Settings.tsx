import { Constants, Linking, WebBrowser } from 'expo';
import { Body, Left, List, ListItem, Right, Text } from 'native-base';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';

import Button from '../components/Button';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import styled, { scale, th } from '../styled';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [UserState, AuthState];
}
const Title = styled(P.H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;
const BodyText = styled(Text)`
  color: ${th('color.grey')};
`;

export class Settings extends React.Component<Props> {
  debug = () => {
    Alert.alert(Constants.linkingUri);
  };
  reportProblem = () => {
    const [userContainer, authContainer] = this.props.states;
    const company = userContainer.state.companies.find(c => c.companyUuid === authContainer.state.companyUuid);
    const { me } = userContainer.state;
    const texts = [
      'Hey 9Spokes team!',
      '',
      "Something's not right in the app and it would be great if you could have a look at it",
      '',
      'Here are my details:',
      'Name:',
      `${me.firstName} ${me.lastName}`,
      '',
      'Company name:',
      company ? company.companyName : '',
      '',
      '9Spokes username:',
      me.emailAddress,
      '',
      'Device info:',
      JSON.stringify(Constants.platform, null, 2),
      '',
      'Tell us about the issue',
      'Thanks',
    ];

    Linking.openURL('mailto:support@9spokes.com?subject=Mobile QUery&body=' + texts.join('\n'));
  };
  render() {
    const [userState, authState] = this.props.states;
    const { me, companies } = userState.state;
    const company = companies ? companies.find(c => c.companyUuid === authState.state.companyUuid) : null;
    return (
      <P.Container>
        <ScrollView>
          <Title>Account</Title>
          <List style={{ backgroundColor: '#fff' }}>
            <ListItem
              onPress={() => {
                this.props.navigation.push(SCREENS[SCREENS.UPDATE_PROFILE]);
              }}>
              <Left>
                <Text>User profile</Text>
              </Left>
              <Body>
                <BodyText>{`${me.firstName} ${me.lastName}`}</BodyText>
              </Body>
              <Right>
                <Ionicons name="ios-arrow-forward" />
              </Right>
            </ListItem>
            <ListItem
              onPress={() => {
                // this.props.navigation.push(SCREENS[SCREENS.UPDATE_COMPANY]);
              }}>
              <Left>
                <Text>Company profile</Text>
              </Left>
              <Body>
                <BodyText>{company && company.companyName}</BodyText>
              </Body>
              <Right>
                <Ionicons name="ios-arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <Title>Support</Title>
          <List style={{ backgroundColor: '#fff' }}>
            <ListItem onPress={this.reportProblem}>
              <Left>
                <Text>Report a problem</Text>
              </Left>

              <Right>
                <Ionicons name="ios-arrow-forward" />
              </Right>
            </ListItem>
            <ListItem onPress={() => WebBrowser.openBrowserAsync('https://support.9spokes.com/hc/en-us')}>
              <Left>
                <Text>Help center</Text>
              </Left>
              <Right>
                <Ionicons name="ios-arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <Title>Legal</Title>

          <List style={{ backgroundColor: '#fff' }}>
            <ListItem
              onPress={() => WebBrowser.openBrowserAsync('https://www.9spokes.com/legal/terms-and-conditions/')}>
              <Left>
                <Text>Terms and conditions</Text>
              </Left>
              <Right>
                <Ionicons name="ios-arrow-forward" />
              </Right>
            </ListItem>
            <ListItem onPress={() => WebBrowser.openBrowserAsync('https://www.9spokes.com/legal/privacy-notice/')}>
              <Left>
                <Text>Privacy policy</Text>
              </Left>
              <Right>
                <Ionicons name="ios-arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <Title>About</Title>
          <List style={{ backgroundColor: '#fff' }}>
            <ListItem onPress={this.debug}>
              <Left>
                <Text>App version</Text>
              </Left>
              <Right>
                <Text>1.0.0</Text>
              </Right>
            </ListItem>
          </List>

          <P.Container hasMargin={true}>
            <Button title="Log out" onPress={this.handleLogout} />
          </P.Container>
        </ScrollView>
      </P.Container>
    );
  }
  handleLogout = () => {
    const [_, authState] = this.props.states;
    authState.clear();
    this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
  };
}
export default SubscribeHOC([userState, authState])(Settings);

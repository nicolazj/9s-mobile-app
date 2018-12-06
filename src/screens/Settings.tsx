import { Ionicons } from '@expo/vector-icons';
import { WebBrowser } from 'expo';
import { Body, Left, List, ListItem, Right, Text } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Button from '../components/Button';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { scale } from '../scale';
import authContainer, { Auth } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import userContainer, { User } from '../states/User';
import styled, { th } from '../styled';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  containers: [User, Auth];
}
const Title = styled(P.H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;
const BodyText = styled(Text)`
  color: ${th('color.grey')};
`;
export class Settings extends React.Component<Props> {
  public render() {
    const [userContainer, authContainer] = this.props.containers as [User, Auth];
    const { me } = userContainer.state;
    const company = userContainer.state.companies.find(c => c.companyUuid === authContainer.state.companyUuid);
    return (
      <P.Container>
        <ScrollView>
          <Title>Account</Title>
          <List style={{ backgroundColor: '#fff' }}>
            <ListItem>
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
            <ListItem>
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
            {/* <ListItem>
              <Left>
                <Text>Currency</Text>
              </Left>
              <Body>
                <Text>User profile</Text>
              </Body>
            </ListItem> */}
          </List>
          <Title>Support</Title>
          <List style={{ backgroundColor: '#fff' }}>
            <ListItem>
              <Left>
                <Text>Report a problem</Text>
              </Left>

              <Right>
                <Ionicons name="ios-arrow-forward" />
              </Right>
            </ListItem>
            <ListItem onPress={() => WebBrowser.openBrowserAsync('https://support.9spokes.com/hc/en-us')}>
              >
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
              >
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
            <ListItem>
              <Left>
                <Text>App version</Text>
              </Left>
              <Right>1.0.0</Right>
            </ListItem>
          </List>
          <P.Container margin>
            <Button title="Log out" onPress={this.handleLogout} />
          </P.Container>
        </ScrollView>
      </P.Container>
    );
  }
  private handleLogout = () => {
    const [_, authContainer] = this.props.containers as [User, Auth];
    authContainer.clear();
    this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
  };
}
export default SubscribeHOC([userContainer, authContainer])(Settings);

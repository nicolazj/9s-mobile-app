import { Body, Left, List, ListItem, Text } from 'native-base';
import React from 'react';
import { ScrollView, TextInput } from 'react-native';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import * as P from '../primitives';
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
  update = () => {
    const [userState_] = this.props.states;
    const { me } = userState_.state;
    const { firstName, lastName } = me;
    agent.user.user.update({ firstName, lastName });
  };
  render() {
    const [userState_] = this.props.states;
    const { me } = userState_.state;
    return (
      <P.Container>
        <NavigationEvents onWillBlur={this.update} />
        <ScrollView>
          <Title>User profile</Title>
          <List style={{ backgroundColor: '#fff' }}>
            <ListItem>
              <Left>
                <Text>First name</Text>
              </Left>
              <Body>
                <TextInput
                  placeholder="First name"
                  placeholderTextColor="#ccc"
                  onChangeText={text => {
                    userState_.setState({
                      me: {
                        ...me,
                        firstName: text,
                      },
                    });
                  }}
                  value={me.firstName}
                />
              </Body>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Last name</Text>
              </Left>
              <Body>
                <TextInput
                  placeholder="Last name"
                  placeholderTextColor="#ccc"
                  onChangeText={text => {
                    userState_.setState({
                      me: {
                        ...me,
                        lastName: text,
                      },
                    });
                  }}
                  value={me.lastName}
                />
              </Body>
            </ListItem>

            <ListItem>
              <Left>
                <Text>Email address</Text>
              </Left>
              <Body>
                <BodyText>{me.emailAddress}</BodyText>
              </Body>
            </ListItem>
          </List>
        </ScrollView>
      </P.Container>
    );
  }
}
export default SubscribeHOC([userState, authState])(Settings);

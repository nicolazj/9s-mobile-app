import { Body, List, ListItem } from 'native-base';
import React from 'react';
import { ScrollView, TextInput } from 'react-native';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import * as P from '../primitives';
import { scale } from '../scale';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import styled from '../styled';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [UserState, AuthState];
}
const Title = styled(P.H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;

export class Settings extends React.Component<Props> {
  update = () => {
    const [userState] = this.props.states;
    const { me } = userState.state;
    const { firstName, lastName } = me;
    agent.user.user.update({ firstName, lastName });
  };
  render() {
    const [userState] = this.props.states;
    const { me } = userState.state;
    return (
      <P.Container>
        <NavigationEvents onWillBlur={this.update} />
        <ScrollView>
          <Title>User profile</Title>
          <List style={{ backgroundColor: '#fff' }}>
            <ListItem>
              <Body>
                <TextInput
                  placeholder="First name"
                  placeholderTextColor="#ccc"
                  onChangeText={text => {
                    userState.setState({
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
              <Body>
                <TextInput
                  placeholder="Last name"
                  placeholderTextColor="#ccc"
                  onChangeText={text => {
                    userState.setState({
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
          </List>
        </ScrollView>
      </P.Container>
    );
  }
}
export default SubscribeHOC([userState, authState])(Settings);

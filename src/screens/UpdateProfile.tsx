import { Body, Left, List, ListItem, Text } from 'native-base';
import React from 'react';
import { ScrollView, TextInput } from 'react-native';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import * as P from '../primitives';
import { useUserStore } from '../stores/user';
import styled, { scale, th } from '../styled';

const Title = styled(P.H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;
const BodyText = styled(Text)`
  color: ${th('color.grey')};
`;
const Settings = () => {
  const { me, actions: userActions } = useUserStore(({ me, actions }) => ({
    me,
    actions,
  }));

  const update = () => {
    const { firstName, lastName } = me!;
    agent.user.user.update({ firstName, lastName });
  };

  return (
    <P.Container>
      <NavigationEvents onWillBlur={update} />
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
                  userActions.set({
                    me: {
                      ...me,
                      firstName: text,
                    },
                  });
                }}
                value={me!.firstName}
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
                  userActions.set({
                    me: {
                      ...me,
                      lastName: text,
                    },
                  });
                }}
                value={me!.lastName}
              />
            </Body>
          </ListItem>

          <ListItem>
            <Left>
              <Text>Email address</Text>
            </Left>
            <Body>
              <BodyText>{me!.emailAddress}</BodyText>
            </Body>
          </ListItem>
        </List>
      </ScrollView>
    </P.Container>
  );
};
export default Settings;

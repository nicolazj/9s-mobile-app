import React from 'react';
import { ScrollView, TextInput } from 'react-native';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import * as P from '../primitives';
import { userStoreAPI, useUserStore } from '../stores/user';
import styled, { scale, th } from '../styled';

const Title = styled(P.H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;
const BodyText = styled(P.Text)`
  color: ${th('color.grey')};
`;
const Settings = () => {
  const { me } = useUserStore(({ me }) => ({
    me: me!,
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
        <P.List style={{ backgroundColor: '#fff' }}>
          <P.ListItem>
            <P.Left>
              <P.Text>First name</P.Text>
            </P.Left>
            <P.Body>
              <TextInput
                placeholder="First name"
                placeholderTextColor="#ccc"
                onChangeText={text => {
                  userStoreAPI.setState({
                    me: {
                      ...me,
                      firstName: text,
                    },
                  });
                }}
                value={me!.firstName}
              />
            </P.Body>
          </P.ListItem>
          <P.ListItem>
            <P.Left>
              <P.Text>Last name</P.Text>
            </P.Left>
            <P.Body>
              <TextInput
                placeholder="Last name"
                placeholderTextColor="#ccc"
                onChangeText={text => {
                  userStoreAPI.setState({
                    me: {
                      ...me,
                      lastName: text,
                    },
                  });
                }}
                value={me!.lastName}
              />
            </P.Body>
          </P.ListItem>

          <P.ListItem>
            <P.Left>
              <P.Text>Email address</P.Text>
            </P.Left>
            <P.Body>
              <BodyText>{me!.emailAddress}</BodyText>
            </P.Body>
          </P.ListItem>
        </P.List>
      </ScrollView>
    </P.Container>
  );
};
export default Settings;

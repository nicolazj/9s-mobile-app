import { Text } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

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
  render() {
    const [userState, authState] = this.props.states;
    const { companies } = userState.state;
    const company = companies ? companies.find(c => c.companyUuid === authState.state.companyUuid) : null;
    return (
      <P.Container>
        <ScrollView>
          <Title>Company profile</Title>
          <BodyText>{company && company.companyName}</BodyText>
        </ScrollView>
      </P.Container>
    );
  }
}
export default SubscribeHOC([userState, authState])(Settings);

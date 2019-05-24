import React from 'react';
import {
    ActivityIndicator, Alert, AsyncStorage, StatusBar, View
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Select from '../components/Select';
import log from '../logging';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import authState, { AuthState } from '../states/Auth';
import cookieState, { CookieState } from '../states/Cookie';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import styled, { scale, th } from '../styled';
import { Company } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AuthState, UserState];
}
const Title = styled(P.H2)`
  color: #aaa;
`;
const SubTitle = styled(P.Text)`
  color: #aaa;
`;
export class SwitchCompany extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  chooseCompany = async (c: Company) => {
    await agent.token.exchange(c.companyUuid);
    let connections = await agent.company.connection.list();
    if (connections.filter(conn => conn.status === 'ACTIVE').length > 0) {
      this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
    } else {
      this.props.navigation.navigate(SCREENS[SCREENS.FORCE_CONNECT]);
    }
  };
  // Render any loading content that you like here
  render() {
    const [_, userState] = this.props.states;
    console.log(userState.state.companies);
    return (
      <P.Container>
        <P.SafeArea>
          <P.Container hasMargin hcenter>
            <Title>Your companies </Title>
            <SubTitle>Select a company to continue</SubTitle>
            {userState.state.companies
              .filter(c => c.isActive === 1)
              .map(c => (
                <Select
                  title={c.companyName}
                  onPress={() => this.chooseCompany(c)}
                  key={c.companyUuid}
                />
              ))}
          </P.Container>
        </P.SafeArea>
      </P.Container>
    );
  }
}

export default SubscribeHOC([authState, userState])(SwitchCompany);

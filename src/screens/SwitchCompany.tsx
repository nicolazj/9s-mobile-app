import React from 'react';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Select from '../components/Select';
import log from '../logging';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import cookieState, { CookieState } from '../states/Cookie';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import { Company } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [CookieState, UserState];
}

export class SwitchCompany extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  chooseCompany = async (c: Company) => {
    const [cookieState] = this.props.states;
    await cookieState.setState({ companyUuid: c.companyUuid });
    await agent.token.exchange(c.companyUuid);
    let connections = await agent.company.connection.list();
    if (connections.filter(conn => conn.status === 'ACTIVE').length > 0) {
      this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
    } else {
      this.props.navigation.navigate(SCREENS[SCREENS.FORCE_CONNECT]);
    }
  };
  render() {
    const [_, userState] = this.props.states;
    return (
      <P.Container>
        <P.SafeArea>
          <P.Container hasMargin hcenter>
            <P.Title>Your companies </P.Title>
            <P.SubTitle>Select a company to continue</P.SubTitle>
            {userState.state.companies
              .filter(c => c.isActive === 1)
              .sort((a, b) => {
                if (a.companyName < b.companyName) {
                  return -1;
                }
                if (a.companyName > b.companyName) {
                  return 1;
                }
                return 0;
              })
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

export default SubscribeHOC([cookieState, userState])(SwitchCompany);

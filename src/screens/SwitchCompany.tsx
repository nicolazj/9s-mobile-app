import React from 'react';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Select from '../components/Select';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import cookieState, { CookieState } from '../states/Cookie';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';

interface Props {
  navigation: NavigationScreenProp<any, { auto: boolean }>;
  states: [CookieState, UserState];
}
interface State {
  manual: boolean;
}

export class SwitchCompany extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { manual: false };
  }

  componentDidMount() {
    this.bootstrapAsync();
  }
  bootstrapAsync = async () => {
    const auto = this.props.navigation.getParam('auto');
    let companies = userState.state.companies;
    if (companies.length === 0) {
      companies = await agent.user.company.list();
      userState.setState({
        companies,
      });
    }

    let companyUuid = null;
    const existedcompanyUuid = cookieState.state.companyUuid;
    if (companies.length === 1) {
      companyUuid = companies[0].companyUuid;
    } else if (existedcompanyUuid && auto) {
      if (companies.find(c => c.companyUuid === existedcompanyUuid)) {
        companyUuid = existedcompanyUuid;
      }
    }
    if (companyUuid) {
      this.chooseCompany(companyUuid);
    } else {
      this.setState({ manual: true });
    }
  };
  chooseCompany = async (companyUuid: string) => {
    const [cookieState_] = this.props.states;
    await cookieState_.setState({ companyUuid });
    await agent.token.exchange(companyUuid);
    let connections = await agent.company.connection.list();
    if (connections.filter(conn => conn.status === 'ACTIVE').length > 0) {
      this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
    } else {
      this.props.navigation.navigate(SCREENS[SCREENS.FORCE_CONNECT]);
    }
  };
  render() {
    const [_, userState] = this.props.states;
    const { manual } = this.state;
    return (
      <P.Container>
        <P.SafeArea>
          {manual && (
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
                    onPress={() => this.chooseCompany(c.companyUuid)}
                    key={c.companyUuid}
                  />
                ))}
            </P.Container>
          )}
        </P.SafeArea>
      </P.Container>
    );
  }
}

export default SubscribeHOC([cookieState, userState])(SwitchCompany);

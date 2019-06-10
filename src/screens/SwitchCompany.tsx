import React from 'react';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Select from '../components/Select';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import { useUserStore } from '../stores/user';

interface Props {
  navigation: NavigationScreenProp<any, { auto: boolean }>;
  states: [AuthState];
}

const SwitchCompany: React.FC<Props> = ({ states, navigation }) => {
  const auto = navigation.getParam('auto');
  const [manual, setManual] = React.useState(false);
  const { companies } = useUserStore(({ companies }) => ({
    companies: companies
      .filter(c => c.isActive === 1)
      .sort((a, b) => {
        if (a.companyName < b.companyName) {
          return -1;
        }
        if (a.companyName > b.companyName) {
          return 1;
        }
        return 0;
      }),
  }));
  const [authState_] = states;

  React.useEffect(() => {
    bootstrapAsync();
  }, []);
  const bootstrapAsync = async () => {
    let companyUuid = null;
    const existedcompanyUuid = authState_.state.companyUuid;
    if (companies.length === 1) {
      companyUuid = companies[0].companyUuid;
    } else if (existedcompanyUuid && auto) {
      if (companies.find(c => c.companyUuid === existedcompanyUuid)) {
        companyUuid = existedcompanyUuid;
      }
    }
    if (companyUuid) {
      selectCompany(companyUuid);
    } else {
      setManual(true);
    }
  };
  const selectCompany = async (companyUuid: string) => {
    await authState_.setState({ companyUuid });
    await agent.token.exchange(companyUuid);
    let connections = await agent.company.connection.list();
    if (connections.filter(conn => conn.status === 'ACTIVE').length > 0) {
      navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
    } else {
      navigation.navigate(SCREENS[SCREENS.FORCE_CONNECT]);
    }
  };

  return (
    <P.Container>
      <P.SafeArea>
        {manual && (
          <P.Container hasMargin hcenter>
            <P.Title>Your companies </P.Title>
            <P.SubTitle>Select a company to continue</P.SubTitle>
            {companies.map(c => (
              <Select
                title={c.companyName}
                onPress={() => selectCompany(c.companyUuid)}
                key={c.companyUuid}
              />
            ))}
          </P.Container>
        )}
      </P.SafeArea>
    </P.Container>
  );
};

export default SubscribeHOC([authState])(SwitchCompany);

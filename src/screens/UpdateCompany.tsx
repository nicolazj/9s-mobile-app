import { Body, Left, List, ListItem, Text } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import * as P from '../primitives';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import { useUserStore } from '../stores/user';
import styled, { scale, th } from '../styled';
import { Industry } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AuthState];
}
const Title = styled(P.H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;
const BodyText = styled(Text)`
  color: ${th('color.grey')};
`;

const UpdateCompany: React.FC<Props> = ({ states }) => {
  const [industries, setIndustries] = React.useState<Industry[]>([]);
  const { companies } = useUserStore(({ companies }) => ({
    companies,
  }));
  React.useEffect(() => {
    let current = true;
    const getIndustries = async () => {
      const industries = await agent.public.industry.get();
      if (current) {
        setIndustries(industries);
      }
    };

    getIndustries();
    return () => {
      current = false;
    };
  }, []);

  const [authState_] = states;
  const company = companies
    ? companies.find(c => c.companyUuid === authState_.state.companyUuid)
    : null;

  const industry =
    company && industries.find(i => i.industryUUID === company.industryUuid);
  return (
    <P.Container>
      <ScrollView>
        <Title>User profile</Title>
        <List style={{ backgroundColor: '#fff' }}>
          <ListItem>
            <Left>
              <Text>Company name</Text>
            </Left>
            <Body>
              <BodyText>{company && company.companyName}</BodyText>
            </Body>
          </ListItem>
          <ListItem>
            <Left>
              <Text>Industry </Text>
            </Left>
            <Body>
              <BodyText>{company && industry && industry.displayName}</BodyText>
            </Body>
          </ListItem>
        </List>
      </ScrollView>
    </P.Container>
  );
};
export default SubscribeHOC([authState])(UpdateCompany);

import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import * as P from '../primitives';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';
import styled, { scale, th } from '../styled';
import { Industry } from '../types';

const Title = styled(P.H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;
const BodyText = styled(P.Text)`
  color: ${th('color.grey')};
`;

const UpdateCompany = () => {
  const [industries, setIndustries] = React.useState<Industry[]>([]);
  const { companies } = useUserStore(({ companies }) => ({
    companies,
  }));
  const companyUuid = useAuthStore(store => store.companyUuid);

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

  const company = companies
    ? companies.find(c => c.companyUuid === companyUuid)
    : null;

  const industry =
    company && industries.find(i => i.industryUUID === company.industryUuid);
  return (
    <P.Container>
      <ScrollView>
        <Title>User profile</Title>
        <P.List style={{ backgroundColor: '#fff' }}>
          <P.ListItem>
            <P.Left>
              <P.Text>Company name</P.Text>
            </P.Left>
            <P.Body>
              <BodyText>{company && company.companyName}</BodyText>
            </P.Body>
          </P.ListItem>
          <P.ListItem>
            <P.Left>
              <P.Text>Industry </P.Text>
            </P.Left>
            <P.Body>
              <BodyText>{company && industry && industry.displayName}</BodyText>
            </P.Body>
          </P.ListItem>
        </P.List>
      </ScrollView>
    </P.Container>
  );
};
export default UpdateCompany;

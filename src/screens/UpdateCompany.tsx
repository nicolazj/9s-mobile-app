import { Body, Left, List, ListItem, Text } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import * as P from '../primitives';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import styled, { scale, th } from '../styled';
import { Industry } from '../types';

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

interface State {
  industries: Industry[];
}

export class UpdateCompany extends React.Component<Props, State> {
  state: State = {
    industries: [],
  };

  async componentDidMount() {
    const industries = await agent.public.industry.get();
    this.setState({ industries });
  }
  render() {
    const [userState_, authState_] = this.props.states;
    const { industries } = this.state;
    const { companies } = userState_.state;
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
                <BodyText>
                  {company && industry && industry.displayName}
                </BodyText>
              </Body>
            </ListItem>
          </List>
        </ScrollView>
      </P.Container>
    );
  }
}
export default SubscribeHOC([userState, authState])(UpdateCompany);

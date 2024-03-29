import React from 'react';
import { Linking, View } from 'react-native';

import Link from '../components/Link';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';
import styled, { scale } from '../styled';

const SuggestAppLink_ = styled(View)`
  align-items: center;
  padding-top: ${scale(20)}px;
  padding-bottom: ${scale(50)}px;
`;
const SuggestAppLink = ({}) => {
  const { companies, me } = useUserStore(({ companies, me }) => ({
    companies,
    me,
  }));
  const companyUuid = useAuthStore(store => store.companyUuid);

  const suggestApp = () => {
    const company = companies.find(c => c.companyUuid === companyUuid);
    const texts = [
      'Hey 9Spokes team!',
      '',
      "A service that I use isn't currently supported on the 9Spokes mobile app and it would be great if you could consider supporting it!",
      '',
      'Here are my details:',
      'Name:',
      `${me!.firstName} ${me!.lastName}`,
      '',
      'Company name:',
      company ? company.companyName : '',
      '',
      '9Spokes username:',
      me!.emailAddress,
    ];

    Linking.openURL(
      'mailto:support@9spokes.com?subject=App Support Request&body=' +
        texts.join('\n')
    );
  };
  return (
    <SuggestAppLink_>
      <Link
        title="Don't see your apps? Tell us what you use"
        onPress={suggestApp}
      />
    </SuggestAppLink_>
  );
};

export default SuggestAppLink;

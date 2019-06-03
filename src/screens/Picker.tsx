import React from 'react';
import { ScrollView } from 'react-native';

import Select from '../components/Select';
import * as P from '../primitives';

export default ({ navigation }) => {
  const { items, title, subTitle, update } = navigation.state.params;
  return (
    <ScrollView>
      <P.Container hasPadding hcenter>
        <P.Title>{title}</P.Title>
        <P.SubTitle>{subTitle}</P.SubTitle>
        {items.map(e => (
          <Select
            title={e.label}
            onPress={() => {
              update(e);
              navigation.goBack();
            }}
            key={e.value}
          />
        ))}
      </P.Container>
    </ScrollView>
  );
};

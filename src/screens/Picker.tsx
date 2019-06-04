import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import Select from '../components/Select';
import * as P from '../primitives';
import { Options } from '../types';

interface Props {
  navigation: NavigationScreenProp<
    any,
    {
      options: Options[];
      placeholder: string;
      title: string;
      subTitle: string;
      onUpdate: (item: Options) => void;
    }
  >;
}

const Picker: React.FC<Props> = ({ navigation }) => {
  const options = navigation.getParam('options');
  const title = navigation.getParam('title');
  const subTitle = navigation.getParam('subTitle');
  const onUpdate = navigation.getParam('onUpdate');
  return (
    <ScrollView>
      <P.Container hasPadding hcenter>
        <P.Title>{title}</P.Title>
        <P.SubTitle>{subTitle}</P.SubTitle>
        {options.map(o => (
          <Select
            title={o.label}
            onPress={() => {
              onUpdate(o);
              navigation.goBack();
            }}
            key={o.value}
          />
        ))}
      </P.Container>
    </ScrollView>
  );
};
export default Picker;

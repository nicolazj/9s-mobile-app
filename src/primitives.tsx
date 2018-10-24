import { View, Text, TextInput as _TextInput, SafeAreaView } from 'react-native';
import { human } from 'react-native-typography';
import { Styles } from 'styled-components';
import styled from './styled';

export const Container = styled(View)`
  flex: 1;
  width: 100%;
`;
export const VCenter = styled(Container)`
  justify-content: center;
`;
export const Center = styled(VCenter)`
  justify-content: center;
  padding: 0 20px;
`;
export const SafeArea = styled(SafeAreaView)`
  flex: 1;
`;
export const TextInput = styled(_TextInput).attrs({ selectionColor: 'red' })`
  border: 1px solid grey;
  width: 100%;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
`;

export const FormTitle = styled(Text)`
  ${human.title1Object as Styles};
`;
